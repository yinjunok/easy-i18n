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
