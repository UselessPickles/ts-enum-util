export default function prune<T extends Record<number | string | symbol, T | any>>(
  objLike: T,
  validator: (value: any, key?: keyof T) => boolean,
) {
  const keys = Object.keys(objLike);
  if (keys?.length === 0) return;

  const isArr = Array.isArray(objLike),
    res: any = isArr ? [] : {};

  for (const key of keys) {
    const origin = objLike[key],
      target = typeof origin === 'object' ? prune(origin, validator) : origin;

    if (validator(origin, key) && validator(target, key)) {
      if (isArr) {
        res.push(target);
      } else {
        res[key] = target;
      }
    }
  }

  return Object.keys(res)?.length === 0 ? undefined : res;
}
