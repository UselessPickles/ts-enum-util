export type Key = string | number | symbol;

export default <T extends unknown>(obj: T, path: Key | Key[]) => {
  const safePath = ([] as any).concat(path);
  let cur: any = obj;
  for (const key of safePath) {
    cur = cur?.[key];
  }
  return cur;
};
