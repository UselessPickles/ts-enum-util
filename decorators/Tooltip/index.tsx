import type { ReactElement } from 'react';
import { curry } from '../utils';
import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd';

// 正反函数
// f(g(x)) = f(g(x)) = x
export type TooltipParams = TooltipProps & {
  visible: boolean;
};
/**
 * 格式化切片
 */

export default curry(
  ({ visible: visible, ...tooltipProps }: TooltipParams, Element: ReactElement) => {
    return visible ? <Tooltip {...tooltipProps}>{Element}</Tooltip> : Element;
  },
);
