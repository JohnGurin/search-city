export type Callback<T> = (value: T) => void

export type PubSub<T> = {
  sub: {
    snapshot: () => T
    subscribe: (cb: Callback<T>) => () => void
  }
  pub: {
    notify: (value: T) => void
  }
}

export const mk_pubsub = <T>(init: T): PubSub<T> => {
  const subs = new Set<Callback<T>>()
  let current = init
  return {
    sub: {
      snapshot: () => current,
      subscribe: (cb: Callback<T>) => {
        cb(current)
        subs.add(cb)
        return () => subs.delete(cb)
      },
    },
    pub: {
      notify: (value: T) => {
        if (value === current) return
        current = value
        for (const s of subs) s(value)
      },
    },
  }
}

export type StateSubscribe<T> = PubSub<T>['sub']

type PubSubPack<T extends object> = {
  pubs: { [k in keyof T]: PubSub<T[k]>['pub'] }
  subs: { [k in keyof T]: PubSub<T[k]>['sub'] }
}

export const mk_pubsub_pack = <T extends object>(cfg: T): PubSubPack<T> =>
  Object.entries(cfg).reduce(
    (acc, [k, v]) => {
      const { pub, sub } = mk_pubsub(v)
      acc.pubs[k as keyof T] = pub
      acc.subs[k as keyof T] = sub
      return acc
    },
    { pubs: {}, subs: {} } as PubSubPack<T>,
  )
