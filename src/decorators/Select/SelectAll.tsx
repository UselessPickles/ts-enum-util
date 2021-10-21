import React, { cloneElement } from 'react';
import type { Select } from 'antd';
import { curry } from '../utils';

export interface SelectAllForwardProps {
  onChange: (...args: any) => void;
  value: any;
}

/**
 * 全选切片
 */
export default curry((Element: ReturnType<typeof Select>) => {
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
    Element?.props?.onChange?.((Element?.props?.value ?? [])?.concat(invert() ?? []));
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
