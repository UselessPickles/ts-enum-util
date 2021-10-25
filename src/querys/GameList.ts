import type { CustomRequestConfig } from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';
import { useQuery, UseQueryOptions } from 'react-query';

export interface GameList {
  gameIcon: string;
  gameName: string;
  packageName: string;
}

type Format<I = any, O = any> = (input: I) => O;

export default <T = GameList[]>({
  format = (res) => res,
  options,
}: {
  format?: Format;
  options?: UseQueryOptions<T>;
} = {}) =>
  useQuery<T>( //查询游戏列表的api
    ['', format, options],
    (opt: CustomRequestConfig) => RESTful.post('fxx/game/prod/page', opt).then(format),
    options,
  );
