import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import { compose, curry, maybe } from '../utils';

// 正反函数
// f(g(x)) = f(g(x)) = x
export interface FormatParams {
  f?: (value: any) => any;
  g?: (value: any) => any;
  valuePropName?: string;
}
/**
 * 格式化切片
 */

export default curry(({ f, g, valuePropName = 'value' }: FormatParams, Element: ReactElement) => {
  return cloneElement(Element, {
    onChange: compose(maybe(Element?.props?.onChange), maybe(f)),
    [valuePropName]: g?.(Element?.props?.[valuePropName]) ?? Element?.props?.[valuePropName],
  });
});
