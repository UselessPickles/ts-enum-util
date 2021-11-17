import {
  Form,
  message,
  Input,
  Modal,
  InputNumber,
  Tabs,
  Tooltip,
  Popconfirm,
  Typography,
} from 'antd';

import { MinusCircleOutlined } from '@ant-design/icons';

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
        content: '确定积分设置吗？再次确定保存成功',
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
      title: '天数',
      canDrag: true,
      span: 0.25,
      render({ field }) {
        return (
          <Item style={{ cursor: 'move' }} key={field.key}>
            第{field.name + 1}天
          </Item>
        );
      },
    },
    {
      title: '下发金币code',
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey}>
            <InputNumber style={{ width: '100%' }} />
          </Item>
        );
      },
    },
    {
      title: '下发金币数量',
      render({ field }) {
        return (
          <Item key={field.key} fieldKey={field.fieldKey}>
            <InputNumber style={{ width: '100%' }} />
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
        title: '签到任务',
      }}
    >
      <Item name={'id'} hidden>
        <Input />
      </Item>

      <DnDForm
        name="ecpmCoinConfigs"
        columns={columns}
        formListProps={{ initialValue: Array(7).fill({}) }}
      >
        {({ title, body }) => {
          return (
            <>
              {title}
              {body}
            </>
          );
        }}
      </DnDForm>
    </DrawerForm>
  );
};
