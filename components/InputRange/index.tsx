import { SwapRightOutlined } from '@ant-design/icons';
import type { ChangeEvent, ReactElement } from 'react';
import React, { Fragment } from 'react';
import styles from './index.less';

export interface RangeProps {
  value?: any[];
  onChange?: (val: RangeProps['value']) => void;
}

export default ({ value, onChange, children }: React.PropsWithChildren<RangeProps>) => {
  function changeHandler(idx: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const copy = ([] as any[]).concat(value);
      copy[idx] = e.currentTarget.value;
      onChange?.(copy);
    };
  }
  return (
    <div className={styles.row}>
      {([] as React.ReactNode[]).concat(children)?.map((child, idx) => (
        <Fragment key={idx}>
          {idx !== 0 && (
            <SwapRightOutlined style={{ color: '#999' }} key={`SwapRightOutlined-${idx}`} />
          )}
          {React.cloneElement(child as ReactElement, {
            onChange: changeHandler(idx),
            value: value?.[idx],
            key: idx,
          })}
        </Fragment>
      ))}
    </div>
  );
};
