// 组合函数
export function compose<T>(...fns: ((args: T) => T)[]) {
  return fns?.reduceRight(
    (pre, next) =>
      (...args) =>
        next(pre(...args)),
    (val: T) => val,
  );
}

export function curry(func: Function) {
  return function curried(...args: any) {
    return args?.length < func?.length
      ? (...args2: any) => curried?.(...args.concat(args2))
      : func?.(...args);
  };
}

export const maybe = curry((fn: (par: any) => any, arg: any) => {
  const tmp = fn?.(arg);
  return ![NaN, undefined, null].includes(tmp) ? tmp : arg;
});
