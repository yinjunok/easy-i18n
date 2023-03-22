import { from, map, reduce, of, zip, concatMap, delay } from 'rxjs'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import { AnalyzeResult } from './analyze'
import config from './config'

const TranslatorClient = tencentcloud.tmt.v20180321.Client

const translator = new TranslatorClient({
  credential: {
    secretId: config.Tencent.SecretId,
    secretKey: config.Tencent.SecretKey,
  },
  region: 'ap-shanghai',
  profile: {
    httpProfile: {
      reqMethod: 'POST',
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
})

export type TranslateText = [string, string[]]

// translator.TextTranslateBatch({
//   Source: 'auto',
//   Target: language,
//   SourceTextList: [...file.keys],
//   ProjectId: 0
// })

const translate = (file: AnalyzeResult) => {
  const sourceTextList = [...file.keys]
  return from(config.targetLanguage).pipe(
    concatMap(language => of(language).pipe(delay(500))),
    concatMap(language => {
      const request$ = from(translator.TextTranslateBatch({
        ProjectId: 0,
        Source: 'auto',
        Target: language,
        SourceTextList: sourceTextList,
      })).pipe(
        map(res => res.TargetTextList)
      )
      return zip(of(language), request$)
    }),
    reduce((acc: TranslateText[], cur) => { acc.push(cur); return [...acc] }, []),
    map(translateText => ({ ...file, sourceTextList, translateText }))
  )
}

export type TranslateType = AnalyzeResult & {
  sourceTextList: string[]
  translateText: TranslateText[]
}

export default translate
