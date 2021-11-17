import { Form, Input, Modal, Typography } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/taskDetail';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import type { EdiTableColumnType } from '@/components/EdiTable';
import EdiTable from '@/components/EdiTable';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';

const { Item } = Form;

const { Text } = Typography;

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

  const columns: EdiTableColumnType<any>[] = [
    {
      title: '天数',
      canDrag: true,
      renderFormItem({ field }) {
        return (
          <Item style={{ cursor: 'move' }} key={field.key}>
            第{field.name + 1}天
          </Item>
        );
      },
    },
    {
      title: '下发金币code',
      renderFormItem({ field }) {
        return (
          <Item shouldUpdate={shouldUpdateManyHOF([['data', field.name, 'coinRuleId']])}>
            {({ getFieldValue, setFields }) => (
              <Item
                key={field.key}
                fieldKey={[field.fieldKey, 'coinRuleId']}
                name={[field.name, 'coinRuleId']}
              >
                <Input
                  style={{ width: '100%' }}
                  onBlur={async () => {
                    try {
                      const coinRuleId = getFieldValue(['data', field?.name, 'coinRuleId']);
                      const coin = await services['coin/parser']({ data: { coinRuleId } });
                      console.log(coin);
                      setFields([
                        {
                          name: ['data', field?.name, 'coinRuleNum'],
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
        );
      },
    },
    {
      title: '下发金币数量',
      dataIndex: 'coinRuleNum',
      render: (text) => {
        return <Text type="secondary">{text ?? '根据填写积分规则ID解析'}</Text>;
      },
    },
  ];

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        onFinish: onSubmit,
      }}
      drawerProps={{
        ...drawerProps,
        onOk: onSubmit,
        title: '签到任务',
      }}
    >
      <Item name={'id'} hidden>
        <Input />
      </Item>

      <EdiTable
        tableProps={{ columns, style: { border: '1px solid #E8EAEC' } }}
        formListProps={{
          name: 'data',
          initialValue: Array(7).fill({}),
        }}
      />
    </DrawerForm>
  );
};
