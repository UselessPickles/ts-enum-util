import ChildrenRender from '@/components/ChildrenRender';
import React, { cloneElement } from 'react';
import { Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { curry } from '../utils';

export interface SelectAllForwardProps {
  onChange: (...args: any) => void;
  value: any;
}

/**
 * 全选切片
 */
export default (Element: ReturnType<typeof Select>) => (
  <ChildrenRender<SelectProps<SelectValue>>>
    {(forwardProps) => SelectAll(forwardProps, Element)}
  </ChildrenRender>
);

export const SelectAll = curry(
  (forwardProps: SelectAllForwardProps, Element: ReturnType<typeof Select>) => {
    const {
        options,
        value: innerValue,
        onChange: innerChange,
      } = Element?.props || {}, // innerProps
      { value: outerValue, onChange: outerChange } = forwardProps,
      value = outerValue ?? innerValue ?? [];

    const onChange: SelectProps<SelectValue>['onChange'] = (...args) => {
      innerChange?.(...args);
      outerChange?.(...args);
    };

    function selectAll() {
      // options里不为disable的, 且value未出现过, 增量添加
      let ret = value?.concat(
        options?.reduce(
          (acc: any[], cur: { disabled: any; value: any }) =>
            cur?.disabled || value?.includes(cur?.value)
              ? acc
              : acc?.concat(cur?.value),
          [],
        ) ?? [],
      );

      onChange?.(ret, options);
    }

    function selectInvert() {
      let ret = options?.reduce(
        (acc: any[], cur: { disabled: boolean; value: any }) =>
          cur?.disabled || value?.includes(cur?.value)
            ? acc
            : acc?.concat(cur?.value),
        [],
      );

      onChange?.(ret, options);
    }

    return cloneElement(Element, {
      mode: 'multiple',
      dropdownRender: (menu: React.ReactNode) => (
        <>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              margin: '8px 12px',
            }}
          >
            <a onClick={selectAll}>全选</a>
            <a onClick={selectInvert}>反选</a>
          </div>
          {menu}
        </>
      ),
      ...forwardProps,
      onChange,
      value,
    });
  },
);

export const PureSelectAll = curry((Element: ReturnType<typeof Select>) => {
  const { options } = Element?.props;
  function invert() {
    return options?.reduce(
      (acc: any[], cur: { disabled: boolean; value: any }) =>
        cur?.disabled || Element?.props?.value?.includes(cur?.value)
          ? acc
          : acc?.concat(cur?.value),
      [],
    );
  }
  function selectAll() {
    // options里不为disable的, 且value未出现过, 增量添加
    Element?.props?.onChange?.(
      (Element?.props?.value ?? [])?.concat(invert() ?? []),
    );
  }

  function selectInvert() {
    Element?.props?.onChange?.(invert());
  }

  return cloneElement(Element, {
    mode: 'multiple',
    dropdownRender: (menu: React.ReactNode) => (
      <>
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            margin: '8px 12px',
          }}
        >
          <a onClick={selectAll}>全选</a>
          <a onClick={selectInvert}>反选</a>
        </div>
        {menu}
      </>
    ),
  });
});
