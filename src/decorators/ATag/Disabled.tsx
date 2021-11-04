import type { ReactElement } from 'react';
import { cloneElement } from 'react';
/**
 * a disabled 切片
 */
export default (disabled: boolean) =>
  (Element: ReactElement<JSX.IntrinsicElements['a'] & { disabled: boolean }>) => {
    if (disabled) {
      return cloneElement(Element, { disabled, onClick: undefined });
    }
    return Element;
  };
