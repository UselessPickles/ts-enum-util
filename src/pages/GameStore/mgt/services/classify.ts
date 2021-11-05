import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

const methods = ['list', 'tree'];

export const services = methods.reduce(
  (acc, method) => ({
    ...acc,
    [method]: (opt?: CustomRequestConfig) => RESTful.post(`fxx/game/classify/${method}`, opt),
  }),
  {} as Record<typeof methods[number], <T = any>(opt?: CustomRequestConfig) => Promise<T>>,
);
