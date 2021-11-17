import { Form, message, Input, Modal, Alert } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/task';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { positiveInteger } from '../utils';
import SearchSelect from '@/components/SearchSelect';

const { Item } = Form;

export default ({
  formProps,
  drawerProps,
  setDrawerProps,
  onSuccess,
  form,
  data = {},
}: ReturnType<typeof useDrawerForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const { id } = data;
  const detail = useQuery(['game-mgt-editor', data.id], () => services.get({ data: { id } }), {
    enabled: !!id,
    refetchOnWindowFocus: false,

    onSuccess(res) {
      const formData = prune(res?.data, isValidValue) ?? {};
      form.setFieldsValue({ ...formData });
    },
  });

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      console.log('value', value);
      const format = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定保存游戏内容吗？再次确定保存成功',
        onOk: async () => {
          try {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
            await services.update({
              // 拼给后端
              data: { ...detail?.data?.data, ...format, versionList: undefined },
              throwErr: true,
            });
            await onSuccess?.();
            setDrawerProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            if (e?.message) {
              message.error(e?.message);
            }
            throw e;
          } finally {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: false }));
          }
        },
      });
    } catch (e: any) {}
  }

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        onFinish: onSubmit,
        style: { marginTop: '34px' },
      }}
      drawerProps={{
        ...drawerProps,
        title: (
          <>
            浏览游戏详情
            <Alert
              style={{
                position: 'absolute',
                transform: 'translate(0%, 50%)',
                width: '100%',
                left: '0',
              }}
              banner
              message="用户当日达到设置的次数，即完成任务，下发金币，此任务单人单日最多完成1次"
            />
          </>
        ),
        onOk: onSubmit,
      }}
    >
      <Item name={'id'} hidden>
        <Input />
      </Item>
      <Item
        name={'浏览游戏详情数量'}
        label={'浏览游戏详情数量'}
        rules={[{ required: true }, { pattern: positiveInteger, message: '仅允许正整数' }]}
      >
        <Input style={{ width: '100%' }} addonAfter="个" placeholder="0" />
      </Item>
      <Item name={'下发金币code'} label={'下发金币code'} rules={[{ required: true }]}>
        <SearchSelect style={{ width: '100%' }} placeholder="请选择中台规则code" />
      </Item>
      <Item name={'下发金币数量'} label={'下发金币数量'}>
        <Input disabled placeholder="根据下发金币code解析" />
      </Item>
    </DrawerForm>
  );
};
