import type { ReactElement } from 'react';
/**
 * a disabled 切片
 */
export default <P extends any = any>(render: (origin: ReactElement<P>) => ReactElement<P>) =>
  (Element: ReactElement<P>) => {
    return render?.(Element) ?? Element;
  };
