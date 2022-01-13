import { useRef } from 'react';

export default (fn: Function, threshold = 500) => {
  const last = useRef<number>(Date.now()),
    timer = useRef<number>(Date.now()),
    g = window || global;
  // 返回的函数，每过 threshold 毫秒就执行一次 fn 函数
  return (...args: any[]) => {
    g.clearTimeout(timer.current);
    const now = Date.now();
    // 如果距离上次执行 fn 函数的时间小于 threshold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last.current + threshold) {
      // 保证在当前时间区间结束后，再执行一次 fn
      timer.current = g.setTimeout(() => {
        last.current = now;
        fn(...args);
      }, threshold);
      // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      g.clearTimeout(timer.current);
      last.current = now;
      fn(...args);
    }
  };
};
