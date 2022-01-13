import { useRef } from 'react';
import type { FormInstance } from 'antd';
import type { ActionRef } from '../';

export interface InitValue {
  actionRef?: ActionRef;
  formRef?: FormInstance;
}

export default (initValue?: InitValue) => {
  // ProTable 实例
  const actionRef = useRef<ActionRef | undefined>(initValue?.actionRef);
  // ProTable 搜索栏实例
  const formRef = useRef<FormInstance | undefined>(initValue?.formRef);

  return {
    actionRef,
    formRef,
  };
};
