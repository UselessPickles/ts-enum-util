import { useState } from 'react';
import type { FormInstance, FormProps, ModalProps } from 'antd';
import { Form } from 'antd';

export interface InitValue {
  modalProps?: ModalProps;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default (initValue?: InitValue) => {
  const [form] = Form.useForm(initValue?.form);

  const [modalProps, setModalProps] = useState<ModalProps>({
    width: 600,
    bodyStyle: { maxHeight: '66.6vh', overflow: 'scroll' },
    onCancel: close,
    ...initValue?.modalProps,
  });

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    layout: 'vertical',
    ...initValue?.formProps,
    validateMessages: { required: '${label} 是必选字段' },
  });

  const [data, setData] = useState<any>(initValue?.data);

  function close() {
    setModalProps((pre) => ({ ...pre, visible: false }));
    form.resetFields();
    setData(undefined);
  }

  return {
    form,
    modalProps,
    setModalProps,
    formProps,
    setFormProps,
    data,
    setData,
  };
};
