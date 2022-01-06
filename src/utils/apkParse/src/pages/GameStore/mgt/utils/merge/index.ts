import type { ReactNode } from 'react';

export type VER_INFO = Record<string, ReactNode>;
export default function merge(...verInfos: VER_INFO[]) {
  // all keys O(n)
  const keys = verInfos?.reduce((acc, cur) => ({ ...acc, ...cur }));

  // merge O(m * n)
  return verInfos?.reduce((acc: Record<string, ReactNode[]>, cur) => {
    const tmp = { ...acc };
    for (const k of Object.keys(keys)) {
      const v = cur[k];
      if (Array.isArray(tmp[k])) {
        tmp[k].push(v);
      } else {
        tmp[k] = [v];
      }
    }
    return tmp;
  }, {});
}
