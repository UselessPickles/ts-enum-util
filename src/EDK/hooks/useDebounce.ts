import { useRef } from 'react';

export default (fn: Function, delay: number) => {
  // 定时器，用来 setTimeout
  const timer = useRef<number>(Date.now()),
    g = window || global;
  return (...arg: any) => {
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    g.clearTimeout(timer.current);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer.current = g.setTimeout(() => fn(...arg), delay);
  };
};
