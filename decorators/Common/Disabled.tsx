import type { ReactElement } from 'react';
import { cloneElement } from 'react';
/**
 * disabled 切片
 */
export default (disabled: boolean) => (Element: ReactElement) =>
  disabled ? cloneElement(Element, { disabled, onClick: void 0 }) : Element;
