import { Form, message, Input } from 'antd';

import DrawerForm from '@/EDK/components/DrawerForm';
import type useDrawerForm from '@/EDK/components/DrawerForm/useDrawerForm';
import { add } from '../services';
import GameSelectV2 from '@/components/GameSelectV2';

const { Item } = Form;

export default ({
  formProps,
  drawerProps,
  setDrawerProps,
  onSuccess,
  form,
}: ReturnType<typeof useDrawerForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  async function onSubmit() {
    try {
      setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
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
      setDrawerProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <DrawerForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      drawerProps={{ onOk: onSubmit, ...drawerProps }}
    >
      <Item label="产品" name="prdId" rules={[{ required: true }]}>
        <Input />
      </Item>

      <Item label="游戏" name="gameId" rules={[{ required: true }]}>
        <GameSelectV2 />
      </Item>
    </DrawerForm>
  );
};
