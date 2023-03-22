import traverse from "@babel/traverse";
import { parse } from '@babel/parser'
import template from "@babel/template";
import * as t from "@babel/types";
import { removeEmptyChar, hasReplaceChar, createI18nCallExpression } from './utils'
import { ReadFileType } from './types'

const analyze = (file: ReadFileType) => {
  const ast = parse(file.text, {
    sourceType: 'module',
    plugins: ['jsx']
  })
  /**
   * 收集中文 key
  */
  const keys = new Set<string>()
  traverse(ast, {
    Program: {
      exit(path) {
        if (keys.size > 0) {
          path.unshiftContainer('body', template(`import { formatMessage } from 'umi-plugin-react/locale';`)())
        }
      }
    },
    /**
     * `字符串 ${a + b} 字符串` -> `${"字符串"} ${a + b} ${"字符串"}`
     * 字符串部分, StringLiteral | JSXText visitor 会替换成 formatMessage()
    */
    TemplateLiteral(path) {
      const { expressions, quasis } = path.node;
      let enCountExpressions = 0;
      quasis.forEach((node, index) => {
        const raw = node.value.raw;
        if (hasReplaceChar(raw)) {
          let newCall = t.stringLiteral(raw);
          expressions.splice(index + enCountExpressions, 0, newCall);
          enCountExpressions++;
          node.value = {
            raw: '',
            cooked: '',
          };
          // 每增添一个表达式都需要变化原始节点,并新增下一个字符节点
          quasis.push(
            t.templateElement(
              {
                raw: '',
                cooked: '',
              },
              false,
            ),
          );
        }
      });
      quasis[quasis.length - 1].tail = true;
    },
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: "formatMessage" })) {
        path.skip()
      }
    },
    JSXText(path) {
      const value = removeEmptyChar(path.node.value)
      if (hasReplaceChar(value)) {
        keys.add(value)
        path.replaceWith(t.jsxExpressionContainer(createI18nCallExpression(value)))
        path.skip()
        return
      }
    },
    ImportDeclaration(path) {
      path.skip()
    },
    StringLiteral(path) {
      /**
       * 一下几种情况应该忽略
       * - switch 的 case 
       * - 对象的字符串作为键
      */
      if (
        path.parentPath.isSwitchCase()
        || (t.isObjectProperty(path.parentPath.node) && path.parentPath.node.key === path.node)
      ) {
        return
      }
      const value = removeEmptyChar(path.node.value)
      if (hasReplaceChar(value)) {
        keys.add(value)
        const newNode = createI18nCallExpression(value)
        if (path.parentPath.isJSXAttribute()) {
          path.replaceWith(t.jsxExpressionContainer(newNode))
          path.skip()
          return
        }
        path.replaceWith(newNode)
        path.skip()
      }
    },
  })

  return { ...file, ast, keys }
}

export type AnalyzeResult = ReturnType<typeof analyze>

export default analyze
