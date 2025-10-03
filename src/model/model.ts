import { fetch_action } from '#/lib/fetch-cities'
import { mk_pubsub_pack } from '#/lib/pubsub'
import { type Brand, brand_cast, type Result } from '#/lib/utils'
import { indicator_base, type MkIndicator } from './indicator'


declare const Query: unique symbol
type Query = string & Brand<typeof Query>
const to_query = brand_cast<string, Query>

declare const RequestId: unique symbol
type RequestId = number & Brand<typeof RequestId>
const to_request_id = brand_cast<number, RequestId>

type Fetched<E, D> = Readonly<{
  request_id: RequestId
  query: string
  result: Result<E, D>
}>

const indicator: MkIndicator<string> = indicator_base

const is_enter = (flags: QueryFlags) => flags & QueryFlags.ENTER
const is_change = (flags: QueryFlags) => flags & QueryFlags.CHANGE

export enum QueryFlags {
  CHANGE = 0b01,
  ENTER = 0b10,
}

type FetchedProposal = Fetched<string, FetchedData>

export type FetchedData = {
  id: string | number
  vals: {
    city: string
    lat: number
    lon: number
    state: string
    pop: number
  }
}[]
export type FetchAction = (
  request_id: RequestId,
  query: string,
  present: (
    proposal: FetchedProposal
  ) => void,
) => void

type model_cfg = {
  input: {
    min_length: number
    max_length: number
    debaunce_delay_ms: number
    enter_throttle_ms: number
  }
}

export const mk_model = (CFG: model_cfg) => {
  const model_data = {
    query: to_query(''),
    input: '',
    input_debounce_timeout_id: 0,
    query_throttle_timeout_id: 0,
    request_id: to_request_id(0),
    fetched: [] as FetchedData,
  }

  const { subs: state, pubs: notify } = mk_pubsub_pack({
    query: model_data.query,
    input: model_data.input,
    fetched: model_data.fetched,
    fetch_indicator: indicator.idle,
  })

  const is_query_length_not_enough = () =>
    model_data.query.length < CFG.input.min_length

  const is_querying = () => model_data.request_id > 0

  const fetch = () => {
    if (is_query_length_not_enough()) return
    notify.fetch_indicator.notify(indicator.loading)
    fetch_action(
      to_request_id(++model_data.request_id),
      model_data.query,
      present.fetch_result,
    )
  }

  const present = {
    query: () => {
      if (model_data.query_throttle_timeout_id > 0 || is_querying()) return
      clearTimeout(model_data.input_debounce_timeout_id)
      model_data.query_throttle_timeout_id = setTimeout(() => {
        model_data.query_throttle_timeout_id = 0
      }, CFG.input.enter_throttle_ms)
      return fetch()
    },

    input: (value: string, flags: number) => {
      if (value.length > CFG.input.max_length) return
      model_data.input = value
      notify.input.notify(value)

      if (!is_change(flags)) return
      const query = value.trim()
      if (model_data.query === query) return
      model_data.query = to_query(query)
      notify.query.notify(model_data.query)

      if (is_query_length_not_enough())
        return notify.fetch_indicator.notify(indicator.idle)

      if (is_enter(flags)) return present.query()

      notify.fetch_indicator.notify(indicator.delaying)
      clearTimeout(model_data.input_debounce_timeout_id)
      model_data.input_debounce_timeout_id = setTimeout(
        fetch,
        CFG.input.debaunce_delay_ms,
      )
    },

    fetch_result: (fetched: FetchedProposal) => {
      if (fetched.request_id !== model_data.request_id) return

      model_data.request_id = to_request_id(0)
      notify.fetch_indicator.notify(indicator.idle)

      if (is_query_length_not_enough()) return
      if (fetched.result.ok) return notify.fetched.notify(fetched.result.data)

      notify.fetch_indicator.notify(indicator.error(fetched.result.err))
    },
  }

  fetch()

  return { state, present }
}
