import ChildrenRender from '../components/ChildrenRender';
import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import { curry, maybe, compose } from './utils';

export interface ForwardProps {
  onChange?: (v: any) => any;
  [key: string]: any;
}

export const IOC = curry((fns: ((pars: any) => any)[], Element: ReactElement) => (
  <ChildrenRender<ForwardProps>>
    {(forwardProps) =>
      compose(...fns)(
        cloneElement(Element, {
          ...forwardProps,
          onChange: compose(
            maybe(forwardProps?.onChange ?? (() => void 0)),
            maybe(Element?.props?.onChange),
          ),
        }),
      )
    }
  </ChildrenRender>
));
