import { useState } from 'react';
import type { FormInstance, FormProps } from 'antd';
import { Form } from 'antd';

import type { CustomDrawerProps } from '.';

export interface InitValue {
  drawerProps?: CustomDrawerProps;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default (initValue?: InitValue) => {
  const [form] = Form.useForm(initValue?.form);

  const [drawerProps, setDrawerProps] = useState<CustomDrawerProps>({
    width: 800,
    onClose: close,
    placement: 'right',
    ...initValue?.drawerProps,
  });

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    layout: 'vertical',
    ...initValue?.formProps,
    validateMessages: { required: '${label} 是必选字段' },
  });

  const [data, setData] = useState<any>(initValue?.data);

  function close() {
    setDrawerProps((pre) => ({ ...pre, visible: false }));
    form.resetFields();
    setData(undefined);
  }

  return {
    form,
    drawerProps,
    setDrawerProps,
    formProps,
    setFormProps,
    data,
    setData,
  };
};
