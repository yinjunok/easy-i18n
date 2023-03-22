import glob from 'glob'
import { resolve } from 'path'
import config from './config'
import { map, Observable, from, concatAll, mergeMap } from 'rxjs'
import { readFile } from 'fs/promises'

const path$ = new Observable<Observable<string>>((observer) => {
  glob(config.input, { ignore: config.ignore }).then(files => {
    observer.next(from(files))
    observer.complete()
  })
})

const file$ = path$.pipe(
  concatAll(),
  map(path => ({ relativePath: path, absolutePath: resolve(__dirname, '../', path) })),
  mergeMap(path => {
    return from(readFile(path.absolutePath, { encoding: 'utf8' }))
      .pipe(map(text => ({ text, path })))
  })
)

export default file$
