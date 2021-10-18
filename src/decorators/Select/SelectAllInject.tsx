import ChildrenRender from '@/components/ChildrenRender';
import { isValidValue } from '@/components/Xmiles/Search';
import { Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { cloneElement } from 'react';
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

export default curry(
  (param: SelectAllInjectParam, Element: ReturnType<typeof Select>) => (
    <ChildrenRender<SelectProps<SelectValue>>>
      {(forwardProps) => SelectAllInject(param, forwardProps, Element)}
    </ChildrenRender>
  ),
);

export const SelectAllInject = curry(
  (
    { inject }: SelectAllInjectParam,
    forwardProps: SelectAllInjectProps,
    Element: ReturnType<typeof Select>,
  ) => {
    const {
        options,
        value: innerValue,
        onChange: innerChange,
      } = Element?.props || {}, // innerProps
      { value: outerValue, onChange: outerChange } = forwardProps,
      value = outerValue ?? innerValue ?? [];

    function injectChange(val: any[], ...args: any) {
      // 已经选择了全选
      const hadAll = value?.includes(inject?.value);
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
      innerChange?.(ret, options);
      outerChange?.(ret, options);
    }

    return cloneElement(Element, {
      ...forwardProps,
      mode: 'multiple',
      options: isValidValue(options) ? [inject]?.concat(options) : [],
      onChange: injectChange,
      value,
    });
  },
);

export const PureSelectAllInject = curry(
  ({ inject }: SelectAllInjectParam, Element: ReturnType<typeof Select>) => {
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
  },
);
