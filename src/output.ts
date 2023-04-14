import { resolve } from 'path'
import generate from "@babel/generator";
import { outputFile } from 'fs-extra'
import prettier from 'prettier'
import config from './config'
import { genKey } from './utils'
import type { TranslateType } from './translate'

export type FileTranslateLanguage = [string, { [Key: string]: string }]
const basePath = resolve(__dirname, '../', config.outputDir)

/**
 * 生成对应键值
*/
const localesgGnerator = (sourceTextList: TranslateType['sourceTextList'], translateText: TranslateType['translateText']): FileTranslateLanguage[] => {
  return translateText.map(trans => {
    const language: FileTranslateLanguage = [trans[0], {}]
    sourceTextList.forEach((text, i) => {
      language[1][genKey(text)] = trans[1][i]
    })
    return language
  })
}

/**
 * 将所有文件键值合并
*/
const mergeLanguage = (languages: FileTranslateLanguage[]) => {
  const language: FileTranslateLanguage[] = []
  languages.forEach(lang => {
    const foundIndex = language.findIndex(l => l[0] === lang[0])

    if (foundIndex !== -1) {
      const found = language[foundIndex]

      language[foundIndex][1] = {
        ...found[1],
        ...lang[1]
      }
    } else {
      language.push(lang as any)
    }
  })
  return language
}

const generateFile = (files: FileTranslateLanguage[]) => {
  files.forEach(f => {
    outputFile(resolve(basePath, 'locales', `${f[0]}.json`), JSON.stringify(f[1], null, 2))
  })
}

/**
 * 替换源码
*/
const replaceSourceCode = (files: TranslateType[]) => {
  files.forEach(file => {
    const code = generate(
      file.ast,
      {
        retainLines: true,
        retainFunctionParens: true,
        jsescOption: {
          minimal: true
        }
      })
      const formatCode = prettier.format(
        code.code,
        {
          semi: false,
          trailingComma: 'all',
          parser: 'babel'
        }
      )
      
      outputFile(
        resolve(basePath, 'code', file.path.relativePath),
        formatCode
      )

      if (config.replaceResource) {
        outputFile(
          file.path.absolutePath,
          formatCode
        )
      }
  })
}

/**
 * 相同语言合并到同一个对象里.
*/
const output = (files: TranslateType[]) => {
  const languageKV = files.flatMap(file => localesgGnerator(file.sourceTextList, file.translateText))
  const languages = mergeLanguage(languageKV)
  generateFile(languages)
  replaceSourceCode(files)
}

export default output
