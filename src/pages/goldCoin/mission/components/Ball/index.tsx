import { Form, Input, Modal, Tabs, Tooltip, Popconfirm, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import DrawerForm from '@/components/DrawerForm@latest';

import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/taskDetail';

import { useMutation, useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { USER_TYPE } from '../../models';
import Options from '@/utils/Options';
import styles from './index.less';
import ChildrenRender from '@/components/ChildrenRender';
import type { EdiTableColumnType } from '@/components/EdiTable';
import EdiTable from '@/components/EdiTable';
import { positiveInteger } from '../utils';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';

const { Item } = Form;

const { TabPane } = Tabs;
const { Link, Text } = Typography;

const FormItemExtra = styled(Item)`
  .ant-form-item-extra {
    position: absolute;
    bottom: -24px;
    white-space: nowrap;
  }
`;

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

  const remover = useMutation((id) => services.delete({ data: id }));

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
      title: '排序',
      canDrag: true,
      width: 75,
      renderFormItem({ field }) {
        return (
          <Item style={{ cursor: 'move' }} key={field.key} fieldKey={[field.fieldKey, 'sort']}>
            {field.name + 1}
          </Item>
        );
      },
    },
    {
      title: (
        <Tooltip
          title="默认从0开始，区间起始框代表第x分钟01秒开始，即xx分01秒，区间结束框代表第x分钟00秒，即xx分00秒，例如设置1-2分钟，表示1分01秒开始，到2分00秒结束"
          key="1"
        >
          分钟区间 <QuestionCircleOutlined />
        </Tooltip>
      ),
      renderFormItem({ field }) {
        return (
          <Item key={field.key} fieldKey={[field.fieldKey, 'ballCondition', 'endRange']} noStyle>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Item
                name={field.name === 0 ? undefined : [field.name - 1, 'ballCondition', 'endRange']}
                initialValue={0}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入"
                  disabled
                  value={field.name === 0 ? 0 : undefined}
                />
              </Item>
              <Item> - </Item>
              <FormItemExtra
                name={[field.name, 'ballCondition', 'endRange']}
                rules={[
                  { required: true, message: '该项不能为空' },
                  ({ getFieldValue }) => ({
                    validator: async (_, value) => {
                      if (
                        (getFieldValue(['ballCondition', field?.name - 1, 'endRange']) ?? 0) >=
                        +value
                      ) {
                        return Promise.reject(new Error('右值需大于左值'));
                      }
                      return Promise.resolve();
                    },
                  }),
                  { pattern: positiveInteger, message: '仅允许正整数' },
                ]}
                dependencies={[['ballCondition', field.name - 1, 'endRange'], ['digitsCount']]}
              >
                <Input style={{ width: '100%' }} placeholder="0" addonAfter="分" />
              </FormItemExtra>
            </div>
          </Item>
        );
      },
    },
    {
      title: '每xx秒下发金币',
      renderFormItem({ field }) {
        return (
          <Item
            key={field.key}
            fieldKey={[field.fieldKey, 'ballCondition', 'perSecond']}
            name={[field?.name, 'ballCondition', 'perSecond']}
            rules={[{ required: true }, { pattern: positiveInteger, message: '仅允许正整数' }]}
          >
            <Input style={{ width: '100%' }} placeholder="0" addonAfter="秒" />
          </Item>
        );
      },
    },
    {
      title: '下发金币code',
      renderFormItem({ field }) {
        return (
          <Item shouldUpdate={shouldUpdateManyHOF([['data', field.name, 'coinRuleId']])} noStyle>
            {({ getFieldValue, setFields }) => (
              <Item
                key={field.key}
                fieldKey={[field.fieldKey, 'coinRuleId']}
                name={[field.name, 'coinRuleId']}
                rules={[{ required: true }]}
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
      width: 150,
      dataIndex: 'coinRuleNum',
      render: (text) => {
        return <Text type="secondary">{text ?? '根据填写积分规则ID解析'}</Text>;
      },
    },
    {
      title: '操作',
      width: 75,
      align: 'center',
      renderFormItem({ field, operation }) {
        const { name, ...restField } = field;
        return (
          <Item
            {...restField}
            fieldKey={[field.fieldKey, 'id']}
            name={[name, 'id']}
            wrapperCol={{ style: { alignItems: 'center' } }}
          >
            <ChildrenRender<any>>
              {({ value }) => (
                <Popconfirm
                  placement="topRight"
                  title="该操作不可逆，请谨慎操作！"
                  onConfirm={() => {
                    if (value !== undefined) {
                      remover.mutate(value);
                    }
                    operation?.remove(field?.name);
                  }}
                  disabled={field?.name === 0}
                >
                  <Link disabled={field?.name === 0}>删除</Link>
                </Popconfirm>
              )}
            </ChildrenRender>
          </Item>
        );
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
        className: styles['modal-title-height'],
        title: (
          <>
            小圆球任务
            <Form form={formProps?.form} component={false}>
              <Item name="userType" valuePropName="activeKey" style={{ position: 'absolute' }}>
                <Tabs>
                  {Options(USER_TYPE).toOpt?.map((opt) => (
                    <TabPane tab={opt.label} key={opt.value} />
                  ))}
                </Tabs>
              </Item>
            </Form>
          </>
        ),
        width: 1000,
      }}
    >
      <EdiTable
        tableProps={{ columns, style: { border: '1px solid #E8EAEC' } }}
        formListProps={{
          name: 'data',
        }}
      >
        {({ body, operation, fields }) => {
          return (
            <>
              {body}

              <Button
                ghost
                type="primary"
                onClick={() => operation.add({ key: fields?.length })}
                icon={<PlusOutlined />}
                style={{ marginTop: '16px' }}
              >
                添加条件
              </Button>
            </>
          );
        }}
      </EdiTable>
    </DrawerForm>
  );
};
