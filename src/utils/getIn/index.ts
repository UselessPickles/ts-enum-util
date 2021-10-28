export default <T extends unknown>(obj: T, path: (keyof T)[] | keyof T) => {
  const safePath = ([] as any).concat(path);
  let cur: any = obj;
  for (const key of safePath) {
    cur = cur?.[key];
  }
  return cur;
};
