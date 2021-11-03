import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export const list = (opt: CustomRequestConfig) =>
  RESTful.post('scenead/new_ad_system/ad_position/group', opt);

export const add = (opt: CustomRequestConfig) =>
  RESTful.post('scenead/overseas/productWithdrawConfig/add', opt);
