import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) => RESTful.post('', opt);

export const gameDelete = (opt: CustomRequestConfig) => RESTful.post('game/category/delete', opt);

export const gameList = (opt: CustomRequestConfig) => RESTful.post('fxx/game/prod/page', opt);

export const updateAPI = (opt: CustomRequestConfig) => RESTful.post('game/category/update', opt);

export const addAPI = (opt: CustomRequestConfig) => RESTful.post('game/category/save', opt);
