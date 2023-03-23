import { Config } from './types'
import tencent from '../tencent-key'

const config: Config = {
  input: 'test-files/**/*.js',
  outputDir: 'languages',
  // replaceCharRange: /[^\x00-\xff]/g,
  replaceCharRange: /[\u4E00-\u9FFF]/g,
  replaceResource: false,
  Tencent: {
    SecretId: tencent.SecretId,
    SecretKey: tencent.SecretKey
  },
  /**
   * 参考文档: https://cloud.tencent.com/document/product/551/40566
   * zh: 简体中文
   * en: 英语
   * ja: 日语
   * es: 西班牙语
   * tr: 土耳其语
   * th: 泰语
   * id: 印尼语
   * zh-Tw: 繁体中文
  */
  targetLanguage: ['zh', 'en', 'ja', 'es', 'tr', 'th', 'id', 'zh-TW']
}

export default config
