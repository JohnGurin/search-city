export type Result<E, D> = Readonly<
  { ok: false, err: E } | { ok: true, data: D }
>

export const Result = {
  ok: <D>(data: D): Result<never, D> => ({ ok: true, data }),
  err: <E>(err: E): Result<E, never> => ({ ok: false, err }),
}

declare const BrandTypeId: unique symbol
export interface Brand<in out K extends string | symbol> {
  readonly [BrandTypeId]: {
    readonly [k in K]: K
  }
}

export const brand_cast = <I, O extends I>(x: I) => x as O

export const identity = <T>(x: T) => x

export const rand_in_range = (
  min: number,
  max: number,
) => (Math.random() * (max - min + 1) + min) >>> 0

export const delay = (
  ms: number,
) => new Promise(resolve => setTimeout(resolve, ms))
