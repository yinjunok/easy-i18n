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
  let needDealWithTemplate = false
  traverse(ast, {
    Program: {
      exit(path) {
        if (keys.size > 0) {
          path.unshiftContainer('body', template(`import { formatMessage } from 'umi-plugin-react/locale';`)())
        }
        if (needDealWithTemplate) {
          path.unshiftContainer('body', template(`import { i18nTaggedTemplates } from '@/utils/utils'`)())
        }
      }
    },
    TaggedTemplateExpression(path) {
      path.skip()
    },
    /**
     * `字符串 ${a + b} 字符串` -> i18nTaggedTemplates`${"字符串"} ${a + b} ${"字符串"}`
    */
    TemplateLiteral(path) {
      const { quasis } = path.node
      let needReplace = false
      quasis.forEach(q => {
        const value = removeEmptyChar(q.value.raw)
        if (hasReplaceChar(value)) {
          keys.add(value)
          needDealWithTemplate = true
          needReplace = true
        }
      })
      if (needReplace) {
        path.replaceWith(
          t.taggedTemplateExpression(t.identifier('i18nTaggedTemplates'), path.node)
        )
      }
      path.skip()
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
