import { present, SEARCH_PARAM_NAME } from '#/init'
import { QueryFlags } from '#/model/model'


const url = new URL(window.location.href)

export const update_url_search_param = (value: string | number) => {
  value
    ? url.searchParams.set(
        SEARCH_PARAM_NAME,
        value.toString(),
      )
    : url.searchParams.delete(SEARCH_PARAM_NAME)
  window.history.replaceState(
    window.history.state,
    '',
    url.toString(),
  )
}

const query_init = url.searchParams.get(SEARCH_PARAM_NAME)
if (query_init) present.input(
  query_init,
  QueryFlags.CHANGE | QueryFlags.ENTER,
)

