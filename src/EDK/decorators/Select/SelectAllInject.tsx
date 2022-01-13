import isValidValue from '../../utils/isValidValue';
import type { Select } from 'antd';
import { cloneElement } from 'react';
import { compose, curry, maybe } from '../utils';

export interface SelectAllInjectParam {
  inject: { label: any; value: any };
}

export interface SelectAllInjectProps {
  onChange: (...args: any) => void;
  value: any;
}

/**
 * 全选切片
 */

export default curry(({ inject }: SelectAllInjectParam, Element: ReturnType<typeof Select>) => {
  const { options } = Element?.props || {}; // innerProps

  function onChange(val: any[]) {
    // 已经选择了全选
    const hadAll = Element?.props?.value?.includes(inject?.value);
    let ret = val;
    // 有"全选", 选"任意", 清除"全选"
    if (hadAll) {
      ret = val.filter((v) => v !== inject?.value);
    } else {
      // 没有"全选" 选 "全选" 清除"其它", 否则就叠加
      if (val?.includes(inject?.value)) {
        ret = [inject?.value];
      }
    }
    return ret;
  }

  return cloneElement(Element, {
    mode: 'multiple',
    options: isValidValue(options) ? [inject]?.concat(options) : [],
    onChange: compose(maybe(Element?.props?.onChange), maybe(onChange)),
  });
});
