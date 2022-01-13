import type { ReactElement } from 'react';
/**
 * custom render 切片
 */
export default <P extends any = any>(render: (origin: ReactElement<P>) => ReactElement<P>) =>
  (Element: ReactElement<P>) => {
    return render?.(Element) ?? Element;
  };
