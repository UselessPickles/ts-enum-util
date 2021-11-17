import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

const methods = ['delete', 'list', 'coin/parser', 'saveOrUpdate'] as const;

export const services = methods.reduce(
  (acc, method) => ({
    ...acc,
    [method]: (opt: CustomRequestConfig) =>
      RESTful.post(`fxx/game/coin/task/detail/${method}`, opt),
  }),
  {} as Record<typeof methods[number], <T = any>(opt: CustomRequestConfig) => Promise<T>>,
);
