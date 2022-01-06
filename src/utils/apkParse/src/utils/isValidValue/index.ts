export default function isValidValue(val: any) {
  // 过滤空
  if ([undefined, null, ''].includes(val)) return false;
  // 过滤空对象 tips: typeof null === 'object'
  if (typeof val === 'object') return Object.values(val)?.length > 0;

  return true;
}
