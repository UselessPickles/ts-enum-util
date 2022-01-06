import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const detail = (opt: CustomRequestConfig) =>
  RESTful.post('fxx/game/auto/test/detail/page', opt);

export const list = (opt: CustomRequestConfig) => RESTful.post('fxx/game/auto/test/page', opt);
