import { useRef } from 'react';
import { FormInstance } from 'antd';
import { ProCoreActionType } from '@ant-design/pro-utils';

export interface InitValue {
  actionRef?: ProCoreActionType;
  formRef?: FormInstance;
}

export default (initValue?: InitValue) => {
  // ProTable 实例
  const actionRef = useRef<ProCoreActionType | undefined>(initValue?.actionRef);
  // ProTable 搜索栏实例
  const formRef = useRef<FormInstance | undefined>(initValue?.formRef);

  return {
    actionRef,
    formRef,
  };
};
