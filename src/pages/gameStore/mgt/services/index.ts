import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) => RESTful.post('fxx/game/test/get', opt);

export const add = (opt: CustomRequestConfig) =>
  RESTful.post('scenead/overseas/productWithdrawConfig/add', opt);
