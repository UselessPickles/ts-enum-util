import { Form, message, Input } from 'antd';

import DrawerForm from '@/EDK/components/DrawerForm';
import type useDrawerForm from '@/EDK/components/DrawerForm/useDrawerForm';
import { services } from '../services';
import GameSelectV2 from '@/components/GameSelectV2';
import SearchSelect from '@/EDK/components/SearchSelect';
import Options from '@/EDK/utils/Options';
import { $enum } from '@/enumUtil/src';
import { PLATFORM } from '../models';
import { useQuery } from 'react-query';

const { Item } = Form;

export default ({
  formProps,
  drawerProps,
  data = {},
  setData,
  setDrawerProps,
  onSuccess,
  form,
}: ReturnType<typeof useDrawerForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const detail = useQuery(
    ['promote-edit-view', data?.id],
    () => services.view({ data: { id: data?.id } }),
    {
      onSuccess: (res) => form.setFieldsValue(res?.data),
      refetchOnWindowFocus: false,
      enabled: !!data?.id,
    },
  );

  async function onSubmit() {
    try {
      setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
      const value = await form?.validateFields();

      const api = data?.mode === 'edit' ? services.update : services.save;

      await api({
        data: value,
        throwErr: true,
      });

      await onSuccess?.();
      setDrawerProps((pre) => ({ ...pre, visible: false }));
      setData(void 0);
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
      drawerProps={{ onOk: onSubmit, confirmLoading: detail?.isFetching, ...drawerProps }}
    >
      <Item label=" id" name="id" hidden>
        <Input disabled />
      </Item>

      {data?.mode !== 'edit' && (
        <>
          <Item
            label="推广计划ID"
            name="popularizePlanId"
            rules={[
              { required: true },
              {
                validator: (_, popularizePlanId) =>
                  services.check({ data: { popularizePlanId }, throwErr: true, notify: false }),
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Item>
          <Item label="推广平台" name="platform">
            <SearchSelect options={Options($enum(PLATFORM).getMap()).toOpt} />
          </Item>

          <Item label="推广计划名称" name="popularizePlanName">
            <Input placeholder="请输入" />
          </Item>
        </>
      )}

      <Item label="关联游戏" name="gameId" rules={[{ required: true }]}>
        <GameSelectV2 placeholder="请选择" />
      </Item>
    </DrawerForm>
  );
};
