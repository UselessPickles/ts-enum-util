import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';

export const coinRuleList = (opt?: CustomRequestConfig) =>
  RESTful.post(`fxx/game/coin/rule/list`, opt);

export const coinRuleBatchUpdate = (opt: CustomRequestConfig) =>
  RESTful.post(`fxx/game/coin/rule/batch/update`, opt);
