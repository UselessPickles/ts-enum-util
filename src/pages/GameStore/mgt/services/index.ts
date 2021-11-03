import { curry } from '@/decorators/utils';
import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export type method = 'page' | 'save' | 'update' | 'get';

export const services = curry((method: method, opt: CustomRequestConfig, env: string) =>
  RESTful.post(`fxx/game/${env}/${method}`, opt),
);
