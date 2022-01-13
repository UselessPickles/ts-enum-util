import type React from 'react';
import { cloneElement } from 'react';
/**
 * 本场搜索切片
 */
export default (Select: React.ReactElement) => {
  return cloneElement(Select, {
    showSearch: true,
    optionFilterProp: 'label',
    filterOption: (input: string, option: any) =>
      option?.value?.toString()?.toLowerCase()?.includes(input?.toString()?.toLowerCase()) ||
      option?.label?.toString()?.toLowerCase()?.includes(input?.toString()?.toLowerCase()),
  });
};
