import * as t from "@babel/types";
import config from './config'

/**
 * 删除换行符, 与左右空白字符
*/
export const removeEmptyChar = (value: string): string => {
  return value.replace(/\n/g, ' ').trim();
};

/**
 * 是否包含需要替换的字符
*/
export const hasReplaceChar = (str: string): boolean => {
  return config.replaceCharRange.test(str)
}

/**
 * 创建替换文本的 i18n 函数调用
*/
export const createI18nCallExpression = (val: string): t.CallExpression => {
  const params = t.objectExpression([t.objectProperty(t.identifier('id'), t.stringLiteral(val))])
  const callNode = t.callExpression(t.identifier('formatMessage'), [params]);
  return callNode
}

/**
 * 带标签的模板字符串
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E5%B8%A6%E6%A0%87%E7%AD%BE%E7%9A%84%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2
*/
export const i18nTaggedTemplates = (strings: TemplateStringsArray, ...p: any[]) => {
  let pIndex = 0
  let resultString = ''
  
  for (let i = 0; i < strings.length - 1; i += 1) {
    const str = removeEmptyChar(strings[i])
    if (hasReplaceChar(str)) {
      resultString += `${formatMessage({ id: str })}${p[pIndex]}`
    } else {
      resultString += `${strings[i]}${p[pIndex]}`
      pIndex += 1
    }
  }

  return resultString
}

function formatMessage(arg0: { id: string; }) {
  throw new Error("Function not implemented.");
}
