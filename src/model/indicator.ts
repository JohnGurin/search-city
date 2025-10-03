enum Tag {
  IDLE,
  DELAYING,
  LOADING,
  ERROR,
}

type Idle = { _tag: Tag.IDLE }
type Delaying = { _tag: Tag.DELAYING }
type Loading = { _tag: Tag.LOADING }
type Error<T> = { _tag: Tag.ERROR, error: T }

type Indicator<Err> = Readonly<Idle | Delaying | Loading | Error<Err>>

const idle: Idle = { _tag: Tag.IDLE }
const delaying: Delaying = { _tag: Tag.DELAYING }
const loading: Loading = { _tag: Tag.LOADING }
const error = <Err>(error: Err): Indicator<Err> => ({
  _tag: Tag.ERROR,
  error,
})

export type MkIndicator<Err> = {
  idle: Indicator<Err>
  delaying: Indicator<Err>
  loading: Indicator<Err>
  error: (error: Err) => Indicator<Err>
}

export const indicator_base = {
  idle,
  delaying,
  loading,
  error,
}

export const match
  = <Err = never, T = unknown>(matcher: {
    idle: T | (() => T)
    delaying: T | (() => T)
    loading: T | (() => T)
    error: T | ((err: Err) => T)
  }) =>
    (indicator: Indicator<Err>) => {
      switch (indicator._tag) {
        case Tag.IDLE:
          return matcher.idle instanceof Function
            ? matcher.idle()
            : matcher.idle
        case Tag.DELAYING:
          return matcher.delaying instanceof Function
            ? matcher.delaying()
            : matcher.delaying
        case Tag.LOADING:
          return matcher.loading instanceof Function
            ? matcher.loading()
            : matcher.loading
        case Tag.ERROR:
          return matcher.error instanceof Function
            ? matcher.error(indicator.error)
            : matcher.error
      }
    }
