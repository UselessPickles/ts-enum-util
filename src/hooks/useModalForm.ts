import { useState } from 'react';
import { Form, FormInstance, FormProps, ModalProps } from 'antd';

export interface InitValue {
  modalProps?: ModalProps;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default (initValue?: InitValue) => {
  const [form] = Form.useForm(initValue?.form);

  const [modalProps, setModalProps] = useState<ModalProps>({
    bodyStyle: { maxHeight: '80vh', overflow: 'scroll' },
    onCancel: close,
    ...initValue?.modalProps,
  });

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
    validateMessages: { required: '该选项是必选项' },
    ...initValue?.formProps,
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
