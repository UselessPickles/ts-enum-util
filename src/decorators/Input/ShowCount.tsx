import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import type { InputProps } from 'antd';
import { Typography } from 'antd';

const { Text } = Typography;
/**
 * Input show count 切片
 */

export default (Element: ReactElement<InputProps>) => {
  const { value = '', maxLength } = Element?.props ?? {};
  if (maxLength !== undefined) {
    return cloneElement(Element, {
      suffix: (
        <Text type="secondary">
          {`${value}`?.length}/{maxLength}
        </Text>
      ),
    });
  }

  return Element;
};
