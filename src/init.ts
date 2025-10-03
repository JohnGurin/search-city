import { mk_model } from '#/model/model'


const { state, present } = mk_model({
  input: {
    min_length: 2,
    max_length: 50,
    debaunce_delay_ms: 500,
    enter_throttle_ms: 500,
  },
})

export const SEARCH_PARAM_NAME = 'q'
export { state, present }
