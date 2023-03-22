import glob from 'glob'

export type Config = {
  /**
   * 需要替换的文件
   * 文档: https://github.com/isaacs/node-glob#readme
  */
  input: Parameters<typeof glob>[0]
  /**
   * 翻译输出文件夹
  */
  outputDir: string
  /**
   * 是否替换源文件
  */
  replaceResource: boolean
  /**
   * 需要忽略的文件
  */
  ignore?: Parameters<typeof glob>[1]['ignore']
  /**
   * unicode cjk 中日韩文 范围 
  */
  replaceCharRange: RegExp
  /**
   * 腾讯云密钥
  */
  Tencent: {
    SecretId: string
    SecretKey: string
  },
  /**
   * 翻译目标语言
   * 支持语言: https://cloud.tencent.com/document/product/551/40566
  */
  targetLanguage: string[]
}

export type ReadFileType = {
  text: string
  path: {
    absolutePath: string
    relativePath: string
  }
}
