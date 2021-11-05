import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

const methods = ['page', 'save', 'update', 'get', 'rollback'] as const;

export const services = methods.reduce(
  (acc, method) => ({
    ...acc,
    [method]: (opt: CustomRequestConfig, env: string) =>
      RESTful.post(`fxx/game/${env}/${method}`, opt),
  }),
  {} as Record<
    typeof methods[number],
    <T = any>(opt: CustomRequestConfig, env: string) => Promise<T>
  >,
);
