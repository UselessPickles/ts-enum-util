export default function prune(
  objlike: Object,
  validtor: (value: any) => boolean,
) {
  if (!validtor(objlike)) return;
  const isArr = Array.isArray(objlike);
  let res: any = isArr ? [] : {};
  for (const key of Object.keys(objlike)) {
    const origin = objlike[key];
    const target =
      typeof origin === 'object' ? prune(origin, validtor) : origin;

    if (validtor(origin) && validtor(target)) {
      if (isArr) {
        res.push(target);
      } else {
        res[key] = target;
      }
    }
  }
  return res;
}
