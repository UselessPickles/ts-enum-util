import {
  Form,
  message,
  Input,
  Modal,
  Switch,
  Space,
  InputNumber,
  Divider,
  Button,
  Tabs,
  Tooltip,
} from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { services } from '../../services';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { compose } from '@/decorators/utils';
import Render from '@/decorators/Common/Render';
import { DnDForm, DnDFormColumn } from '@/components/DnDForm';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { RuleRender } from 'antd/lib/form';
import { USER_TYPE } from '../../models';
import Options from '@/utils/Options';

const { Item } = Form;

const { TabPane } = Tabs;

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
  modalProps,
  setModalProps,
  onSuccess,
  form,
  data = {},
}: ReturnType<typeof useModalForm> & {
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
            setModalProps((pre) => ({ ...pre, confirmLoading: true }));
            await services.update({
              // 拼给后端
              data: { ...detail?.data?.data, ...format, versionList: undefined },
              throwErr: true,
            });
            await onSuccess?.();
            setModalProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            if (e?.message) {
              message.error(e?.message);
            }
            throw e;
          } finally {
            setModalProps((pre) => ({ ...pre, confirmLoading: false }));
          }
        },
      });
    } catch (e: any) {}
  }

  const columns: DnDFormColumn[] = [
    {
      title: '排序',
      canDrag: true,
      render({ field }) {
        return <Item key={field.key}>{field.name + 1}</Item>;
      },
    },
    {
      title: (
        <Tooltip
          title="
                默认从0开始，区间起始框代表第x分钟01秒开始，即xx分01秒，区间结束框代表第x分钟00秒，即xx分00秒，例如设置1-2分钟，表示1分01秒开始，到2分00秒结束"
          key="1"
        >
          设置分钟区间 <QuestionCircleOutlined />
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
                <Input style={{ width: '100%' }} placeholder="请输入" />
              </FormItemExtra>
            </div>
          </Item>
        );
      },
    },
    {
      title: '每xx秒下发金币',
      render({ field }) {
        return <Item key={field.key} fieldKey={field.fieldKey}></Item>;
      },
    },
  ];

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        ...formProps,
      }}
      modalProps={{
        onOk: onSubmit,
        visible: true,
        ...modalProps,
      }}
    >
      <Item name={'id'} hidden>
        <Input />
      </Item>

      <Item name="用户类型">
        <Tabs type="card">
          {Options(USER_TYPE).toOpt?.map(({ value, label }) => (
            <TabPane tab={label} key={value} />
          ))}
        </Tabs>
      </Item>

      <DnDForm name="ecpmCoinConfigs" columns={columns} formListProps={{ initialValue: [{}] }}>
        {({ title, body, operation }) => {
          return (
            <>
              {title}
              {body}
              <a onClick={() => operation.add()}>+ 添加区间</a>
            </>
          );
        }}
      </DnDForm>
    </ModalForm>
  );
};
