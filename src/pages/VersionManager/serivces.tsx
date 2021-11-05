import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) => RESTful.post('fxx/game/version/page', opt);
export const check = (opt: CustomRequestConfig) => RESTful.post('fxx/game/version/check', opt);
export const upload = (opt: CustomRequestConfig) => RESTful.post('fxx/game/version/save', opt);
