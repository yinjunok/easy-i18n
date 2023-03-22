import { map, concatMap, filter, toArray } from 'rxjs'
import output from './output'
import analyze from './analyze';
import translate from './translate';
import files$ from './get-files'

files$.pipe(
  map(file => analyze(file)),
  filter(file => file.keys.size > 0),
  concatMap(f => translate(f)),
  toArray(),
).subscribe(files => {
  output(files)
})