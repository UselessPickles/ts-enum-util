import RESTful, { CustomRequestConfig } from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) => RESTful.post('', opt);

export const AddorUpdate = (opt: CustomRequestConfig) => RESTful.post('', opt);

export const gameList = (opt: CustomRequestConfig) => RESTful.post('', opt);
