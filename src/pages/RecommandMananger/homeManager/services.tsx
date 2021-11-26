import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) => RESTful.post('fxx/game/index/page', opt);
export const deleteGame = (opt: CustomRequestConfig) => RESTful.post('fxx/game/index/delete', opt);
export const add = (opt: CustomRequestConfig) => RESTful.post('fxx/game/index/save', opt);
export const edit = (opt: CustomRequestConfig) => RESTful.post('fxx/game/index/update', opt);
