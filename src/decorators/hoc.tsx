import ChildrenRender from '@/components/ChildrenRender';
import React, { ReactElement, cloneElement } from 'react';
import { curry, maybe, compose } from './utils';

export interface ForwardProps {
  onChange?: (v: any) => any;
  [key: string]: any;
}

export const IOC = curry(
  (fns: Array<(pars: any) => any>, Element: ReactElement) => (
    <ChildrenRender<ForwardProps>>
      {(forwardProps) =>
        compose(...fns)(
          cloneElement(Element, {
            ...forwardProps,
            onChange: compose(
              maybe(forwardProps?.onChange),
              maybe(Element?.props?.onChange),
            ),
          }),
        )
      }
    </ChildrenRender>
  ),
);
