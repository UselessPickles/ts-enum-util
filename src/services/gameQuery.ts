import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const gameList = (opt: CustomRequestConfig) => RESTful.post('fxx/game/prod/page', opt); //游戏列表
