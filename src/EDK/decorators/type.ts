// https://github.com/millsp/medium/blob/master/types-curry-ramda/src/index.ts

export type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

// export type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer TT) => any
//   ? TT
//   : [];

export type Tail<T extends any[]> = T extends [head: any, ...tail: infer TT] ? TT : never;

export type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

export type ObjectInfer<O> = O extends { a: infer A }
  ? A // If true
  : never; // If false

export type FunctionInfer<F> = F extends (...args: infer A) => infer R
  ? [A, R] // If true
  : never; // If false

export type ClassInfer<I> = I extends Promise<infer G> ? G : never;

export type ArrayInfer<T> = T extends (infer U)[] ? U : never;

export type TupleInfer<T> = T extends [infer A, ...(infer B)[]] ? [A, B] : never;

// export type Last<T extends any[]> = {
//   0: Last<Tail<T>>;
//   1: Head<T>;
// }[HasTail<T> extends true ? 0 : 1];

export type Last<T extends any[]> = T extends [...any, infer L] ? L : T[0];

export type Length<T extends any[]> = T['length'];

export type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (
  ...args: infer U
) => any
  ? U
  : T;

export type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>;
  1: T;
}[Length<I> extends N ? 1 : 0];

export type Pos<I extends any[]> = Length<I>;

export type Next<I extends any[]> = Prepend<any, I>;

export type Prev<I extends any[]> = Tail<I>;

export type Iterator<Index extends number = 0, From extends any[] = [], I extends any[] = []> = {
  0: Iterator<Index, Next<From>, Next<I>>;
  1: From;
}[Pos<I> extends Index ? 1 : 0];

export type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
  0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;
  1: R;
}[Pos<I> extends Length<T> ? 1 : 0];

export type Concat<T1 extends any[], T2 extends any[]> = Reverse<
  Reverse<T1> extends infer R ? Cast<R, any[]> : never,
  T2
>;

export type Append<E, T extends any[]> = Concat<T, [E]>;

export type Placeholder = '@@__placeholder__';
export const __: Placeholder = '@@__placeholder__';

export type GapOf<
  T1 extends any[],
  T2 extends any[],
  TN extends any[],
  I extends any[],
> = T1[Pos<I>] extends Placeholder ? Append<T2[Pos<I>], TN> : TN;

export type GapsOf<
  T1 extends any[],
  T2 extends any[],
  TN extends any[] = [],
  I extends any[] = [],
> = {
  0: GapsOf<T1, T2, GapOf<T1, T2, TN, I> extends infer G ? Cast<G, any[]> : never, Next<I>>;
  1: Concat<TN, Drop<Pos<I>, T2> extends infer D ? Cast<D, any[]> : never>;
}[Pos<I> extends Length<T1> ? 1 : 0];

export type PartialGaps<T extends any[]> = {
  [K in keyof T]?: T[K] | Placeholder;
};

export type CleanedGaps<T extends any[]> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>>;

export type Cast<X, Y> = X extends Y ? X : Y;

export type CurryV6<P extends any[], R> = <T extends any[]>(
  ...args: Cast<T, Gaps<P>>
) => GapsOf<T, P> extends [any, ...any[]]
  ? CurryV6<GapsOf<T, P> extends infer G ? Cast<G, any[]> : never, R>
  : R;

export type CurryV7<F extends (...args: any) => any> = <T extends any[]>(
  ...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>
) => GapsOf<T, Parameters<F>> extends [any, ...any[]]
  ? CurryV6<GapsOf<T, Parameters<F>> extends infer G ? Cast<G, any[]> : never, ReturnType<F>>
  : ReturnType<F>;

export type Curry<F extends (...args: any) => any> = <T extends any[]>(
  ...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>
) => GapsOf<T, Parameters<F>> extends [any, ...any[]]
  ? Curry<
      (...args2: GapsOf<T, Parameters<F>> extends infer G ? Cast<G, any[]> : never) => ReturnType<F>
    >
  : ReturnType<F>;
