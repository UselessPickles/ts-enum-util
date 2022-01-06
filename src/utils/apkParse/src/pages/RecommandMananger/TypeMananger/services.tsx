import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const listDetail = (opt: CustomRequestConfig) => RESTful.post('fxx/game/category/get', opt); //游戏详情 查询已选游戏表
export const list = (opt: CustomRequestConfig) => RESTful.post('fxx/game/category/page', opt);
export const gameDelete = (opt: CustomRequestConfig) =>
  RESTful.post('fxx/game/category/delete', opt);
export const updateAPI = (opt: CustomRequestConfig) =>
  RESTful.post('fxx/game/category/update', opt);
export const addAPI = (opt: CustomRequestConfig) => RESTful.post('fxx/game/category/save', opt);
export const check = (opt: CustomRequestConfig) => RESTful.post('fxx/game/category/check', opt);
