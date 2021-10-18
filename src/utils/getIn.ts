export default <T extends unknown>(obj: T, ...path: Array<keyof T>) => {
  const safePath = ([] as any).concat(...path);
  let cur: any = obj;
  for (const key of safePath) {
    cur = cur?.[key];
  }
  return cur;
};
