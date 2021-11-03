import { curry } from '@/decorators/utils';
import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export type method = 'list' | 'tree';

export const services = curry((method: method, opt: CustomRequestConfig) =>
  RESTful.post(`fxx/game/classify/${method}`, opt),
);
