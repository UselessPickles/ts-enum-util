import { Form, message, Input, Modal, Alert } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/taskDetail';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { positiveInteger } from '../utils';
import SearchSelect from '@/components/SearchSelect';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';

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
  const { taskId } = data;
  const detail = useQuery(
    ['coin/task/detail/list', taskId],
    () => services.list({ data: { taskId } }),
    {
      enabled: !!taskId,
      refetchOnWindowFocus: false,
      onSuccess(res) {
        const formData = prune(res?.data, isValidValue) ?? {};
        form.setFieldsValue({ data: formData });
      },
    },
  );

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      console.log('value', value);
      const format = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定积分设置吗？再次确定保存成功',
        onOk: async () => {
          try {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
            await services.saveOrUpdate({
              // 拼给后端
              data: { ...format },
              throwErr: true,
            });
            await onSuccess?.();
            setDrawerProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            console.error(e?.message);
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
            首次玩游戏
            <Alert
              style={{
                position: 'absolute',
                transform: 'translate(0%, 50%)',
                width: '100%',
                left: '0',
              }}
              banner
              message="每个用户最多获得1次，玩游戏数量达标，即下发金币"
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
        name={['data', 0, 'commonCondition', 'condition']}
        label={'玩游戏数量'}
        rules={[{ required: true }, { pattern: positiveInteger, message: '仅允许正整数' }]}
      >
        <Input style={{ width: '100%' }} addonAfter="个" placeholder="0" />
      </Item>

      <Item shouldUpdate={shouldUpdateManyHOF([['data', 0, 'coinRuleId']])} noStyle>
        {({ getFieldValue, setFields }) => (
          <Item name={['data', 0, 'coinRuleId']} label="下发金币code" rules={[{ required: true }]}>
            <Input
              style={{ width: '100%' }}
              onBlur={async () => {
                try {
                  const coinRuleId = getFieldValue(['data', 0, 'coinRuleId']);
                  const coin = await services['coin/parser']({ data: { coinRuleId } });
                  console.log(coin);
                  setFields([
                    {
                      name: ['data', 0, 'coinRuleNum'],
                      value: coin?.data?.minCoin,
                    },
                  ]);
                } catch (e) {
                  console.error(e);
                }
              }}
              placeholder="请填写中台的积分规则ID"
            />
          </Item>
        )}
      </Item>

      <Item name={['data', 0, 'coinRuleNum']} label={'下发金币数量'}>
        <Input disabled placeholder="根据下发金币code解析" />
      </Item>
    </DrawerForm>
  );
};
