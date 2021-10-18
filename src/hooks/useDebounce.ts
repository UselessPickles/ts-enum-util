import { useRef } from 'react';
// 摘自 http://hackll.com/2015/11/19/debounce-and-throttle/

declare global {
  interface Window {
    timer?: number;
  }
}

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export function debounce(fn: Function, delay: number) {
  // 定时器，用来 setTimeout
  let timer: number,
    g = window || global;

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return (...arg: any) => {
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    g.clearTimeout(timer);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = g.setTimeout(() => fn(...arg), delay);
  };
}

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
