import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

const methods = ['check', 'delete', 'page', 'save', 'update'] as const;

export const services = methods.reduce(
  (acc, method) => ({
    ...acc,
    [method]: (opt: CustomRequestConfig) => RESTful.post(`fxx/game/hot/word/${method}`, opt),
  }),
  {} as Record<typeof methods[number], <T = any>(opt?: CustomRequestConfig) => Promise<T>>,
);
