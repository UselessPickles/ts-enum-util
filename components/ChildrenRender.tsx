import type { ReactElement } from 'react';

export default <T extends unknown>({
  children,
  ...props
}: {
  children: (props: T) => ReactElement;
}) => children?.(props as T);
