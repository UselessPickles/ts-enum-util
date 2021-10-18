import { Form, message, Input } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { add } from '../services';

const { Item } = Form;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  async function onSubmit() {
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      const value = await form?.validateFields();

      await add({
        data: value,
        throwErr: true,
      });

      onSuccess?.();
    } catch (e: any) {
      if (e?.message) {
        message.error(e?.message);
      }
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="tab">
        <Input />
      </Item>
    </ModalForm>
  );
};
