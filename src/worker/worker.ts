import type { FetchedData } from '#/model/model'
import Fuse from 'fuse.js/basic'
import { countries, rows } from './data'


const QUERY_LIMIT = 10

const fuse = new Fuse(
  rows,
  {
    threshold: 0.3,
    keys: ['0'],
  },
)

self.onmessage = (event: MessageEvent<string>) => {
  const query = event.data.toLowerCase()
  const result: FetchedData
    = fuse
      .search(query)
      .slice(0, QUERY_LIMIT)
      .map(({ item }) => ({
        id: item[5],
        vals: {
          city: item[0],
          lat: item[1],
          lon: item[2],
          state: countries[item[3]],
          pop: item[4],
        },
      }))

  self.postMessage(result)
}
