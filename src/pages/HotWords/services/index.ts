import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

const arr = ['check', 'delete', 'page', 'save', 'update'] as const;

export const services = arr.reduce(
  (acc, method) => ({
    ...acc,
    [method]: (opt: CustomRequestConfig) => RESTful.post(`fxx/game/hot/word/${method}`, opt),
  }),
  {} as Record<typeof arr[number], <T = any>(opt?: CustomRequestConfig) => Promise<T>>,
);
