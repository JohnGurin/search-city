import { rand_in_range, Result } from '#/lib/utils'
import type { FetchAction, FetchedData } from '#/model/model'
import Worker from '#/worker/worker.ts?worker'


const myWorker = new Worker()

export const fetch_action: FetchAction = (request_id, query, present) => {
  myWorker.onmessage = (event: MessageEvent<FetchedData>) => {
    setTimeout(() => {
      present({
        request_id,
        query,
        result: Math.random() > 0.9
          ? Result.err(`error fetching: ${query}`)
          : Result.ok(event.data),
      })
    }, rand_in_range(0, 1_000))
  }

  myWorker.postMessage(query)
}
