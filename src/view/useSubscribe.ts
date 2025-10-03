import { useSyncExternalStore } from 'react'
import type { StateSubscribe } from '#/lib/pubsub'


export const useSubscribe = <T>(s: StateSubscribe<T>) =>
  useSyncExternalStore(s.subscribe, s.snapshot)
