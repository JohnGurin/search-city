import { rand_in_range, Result } from '#/lib/utils'
import type { FetchAction, FetchedData } from '#/model/model'


const random_string = (len: number) =>
  (Math.random() + 1).toString(36).substring(len)
export const fetch_action: FetchAction = (request_id, query, present) => {
  const delay = rand_in_range(500, 100)
  const is_err = Math.random() > 0.7
  setTimeout(() => {
    let count = 0
    const result = is_err
      ? Result.err(`error fetching: ${query}`)
      : Result.ok(
          Array.from(
            { length: rand_in_range(5, 10) },
            () => ({
              id: count++,
              vals: {
                city: query,
                lat: rand_in_range(-90, 90),
                lon: rand_in_range(-180, 180),
                state: random_string(5),
                pop: rand_in_range(0, 1000),
              },
            }),
          ) as FetchedData,
        )
    present({ request_id, query, result })
  }, delay)
}
