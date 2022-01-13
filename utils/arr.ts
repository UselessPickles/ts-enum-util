export default <V extends any = unknown>(num: number, init: V = Object.create(null)): V[] =>
  Array(num).fill(init);
