import { curry } from '@/decorators/utils';
import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export type method = 'save' | 'get';

export const services = curry((method: method, opt: CustomRequestConfig) =>
  RESTful.post(`fxx/game/test/sync/${method}`, opt),
);
