export default function trimEndWith(s1: string, s2: string) {
  return s1?.endsWith?.(s2) ? s1?.slice?.(0, -s2?.length) : s1;
}
