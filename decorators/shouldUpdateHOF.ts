import getIn from '../utils/getIn';
import type { FormItemProps } from 'antd';

export default (name: FormItemProps['name']): FormItemProps['shouldUpdate'] => {
  const safePath = ([] as any).concat(name);
  return (p, n) => getIn(p, safePath) !== getIn(n, safePath);
};

export function shouldUpdateManyHOF(names: FormItemProps['name'][]): FormItemProps['shouldUpdate'] {
  return (p, n) =>
    names.reduce((acc: boolean, name) => {
      const safePath = ([] as any).concat(name);
      return acc || getIn(p, safePath) !== getIn(n, safePath);
    }, false);
}
