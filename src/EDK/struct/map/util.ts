export type KayOf<M> = M extends Map<infer K, any> ? K : never;
export type ValueOf<M> = M extends Map<any, infer V> ? V : never;

export type MapReduceCallback<M, K, V, U> = (
  accumulator: U,
  currentValue: V,
  currentKey: K,
  index: number,
  map: M,
) => U;

export function MapReduce<
  M extends Map<any, any>,
  K extends KayOf<M>,
  V extends ValueOf<M>,
  U extends any,
>(map: M, callback: MapReduceCallback<M, K, V, U>, initialValue: U): U {
  let acc = initialValue,
    i = 0;
  for (const [k, v] of map) {
    acc = callback(acc, v, k, i++, map);
  }
  return acc;
}
