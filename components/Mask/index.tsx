import styles from './index.less';

import type { PropsWithChildren } from 'react';
import React from 'react';

export interface MaskProps {
  maskProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  toolbarProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
}

export default function ({
  children,
  maskProps,
  containerProps,
  toolbarProps,
}: PropsWithChildren<MaskProps>) {
  return (
    <div {...containerProps} className={styles['mask-container']}>
      {children}
      <span {...maskProps} className={[styles.mask, styles['mask-tool']].join(' ')}>
        <span {...toolbarProps} className={styles['mask-tool-bar']} />
      </span>
    </div>
  );
}
