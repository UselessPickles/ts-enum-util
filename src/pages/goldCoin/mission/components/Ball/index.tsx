import { Form, message, Input, Modal, Tabs, Tooltip, Popconfirm, Button, Typography } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import DrawerForm from '@/components/DrawerForm@latest';

import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/task';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { compose } from '@/decorators/utils';
import Render from '@/decorators/Common/Render';
import type { DnDFormColumn } from '@/components/DnDForm';
import { DnDForm } from '@/components/DnDForm';
import disabled from '@/decorators/ATag/Disabled';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { RuleRender } from 'antd/lib/form';
import { USER_TYPE } from '../../models';
import Options from '@/utils/Options';
import styles from './index.less';

const { Item } = Form;

const { TabPane } = Tabs;
const { Link } = Typography;

const FormItemExtra = styled(Item)`
  .ant-form-item-extra {
    position: absolute;
    bottom: -24px;
    white-space: nowrap;
  }
`;

const valiadNumber: RuleRender = ({ getFieldValue }) => ({
  validator: (_, value) => {
    const digitsCount: number = getFieldValue('digitsCount') ?? 0;

    if (Number.isNaN(+value)) {
      return Promise.reject(new Error('只能是数字'));
    }

    if (+value < 0) {
      return Promise.reject(new Error('必须是正数'));
    }
    if ((value?.split?.('.')?.[1]?.length ?? 0) > digitsCount) {
      return Promise.reject(new Error(`最多支持${digitsCount}位小数`));
    }

    return Promise.resolve();
  },
});

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

  const columns: DnDFormColumn[] = [
    {
      title: '排序',
      canDrag: true,
      span: 0.5,
      render({ field }) {
        return (
          <Item style={{ cursor: 'move' }} key={field.key}>
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
      span: 2,
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey} noStyle>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Item
                name={field.name === 0 ? undefined : [field.name - 1, 'ecpmCoinMax']}
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
                name={[field.name, 'ecpmCoinMax']}
                rules={[
                  { required: true, message: '该项不能为空' },
                  ({ getFieldValue }) => ({
                    validator: async (_, value) => {
                      if (
                        (getFieldValue(['ecpmCoinConfigs', field?.name - 1, 'ecpmCoinMax']) ?? 0) >=
                        +value
                      ) {
                        return Promise.reject(new Error('右值需大于左值'));
                      }
                      return Promise.resolve();
                    },
                  }),
                  valiadNumber,
                ]}
                dependencies={[['ecpmCoinConfigs', field.name - 1, 'ecpmCoinMax'], ['digitsCount']]}
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
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey}>
            <Input style={{ width: '100%' }} placeholder="0" addonAfter="秒" />
          </Item>
        );
      },
    },
    {
      title: '下发金币code',
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey}>
            <Input style={{ width: '100%' }} />
          </Item>
        );
      },
    },
    {
      title: '下发金币数量',
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey}>
            <Input style={{ width: '100%' }} />
          </Item>
        );
      },
    },
    {
      title: '操作',
      span: 0.125,
      render({ field, operation }) {
        return (
          <Item>
            <Popconfirm
              placement="topRight"
              title="该操作不可逆，请谨慎操作！"
              onConfirm={() => operation.remove(field.name)}
              disabled={field?.name === 0}
            >
              {compose(disabled(field?.name === 0))(<Link>删除</Link>)}
            </Popconfirm>
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
              <Item name="tab" valuePropName="activeKey" style={{ position: 'absolute' }}>
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
      <Item name={'id'} hidden>
        <Input />
      </Item>

      <DnDForm name="ecpmCoinConfigs" columns={columns} formListProps={{ initialValue: [{}] }}>
        {({ title, body, operation }) => {
          return (
            <>
              {title}
              {body}

              <Button
                ghost
                type="primary"
                onClick={() => operation.add()}
                icon={<PlusOutlined />}
                style={{ marginTop: '16px' }}
              >
                添加条件
              </Button>
            </>
          );
        }}
      </DnDForm>
    </DrawerForm>
  );
};
