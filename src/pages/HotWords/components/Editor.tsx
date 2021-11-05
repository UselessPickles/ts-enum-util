import type { InputProps } from 'antd';
import { Form, message, Input, Modal, Radio } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';

import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';
import { services } from '../services';

import showCount from '@/decorators/Input/ShowCount';
import type { ReactElement } from 'react';

import Options from '@/utils/Options';
import { STATUS } from '../models';
import RESTful from '@/utils/RESTful';
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
    const value = await form?.validateFields();

    Modal.confirm({
      title: '请进行二次确认',
      content: '确定保存热词吗？',
      onOk: async () => {
        try {
          setModalProps((pre) => ({ ...pre, confirmLoading: true }));
          if (value.id) {
            await services.update({
              data: value,
              throwErr: true,
            });
          } else {
            await services.save({
              data: value,
              throwErr: true,
            });
          }
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
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: { showStatus: 1 },
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="id" label="id" hidden>
        <Input disabled />
      </Item>
      <Item name="word" label="热词名称" rules={[{ required: true }]}>
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={20} />)}
      </Item>

      <Item
        name="sort"
        label="展示位置"
        rules={[
          { required: true },
          { pattern: /^([1-9]|10)$/, message: '请输入1-10区间的数字（包含1和10）' },
          ({ getFieldValue }) => ({
            async validator(_, value) {
              const res = await RESTful.get(
                `fxx/game/hot/word/numOption/${getFieldValue(['id']) ?? ''}`,
              );
              if (!res?.data?.data?.includes(value)) {
                return Promise.reject(new Error('该数字已经使用'));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={2} />)}
      </Item>

      <Item
        name="showStatus"
        label="展示状态"
        rules={[
          { required: true },
          ({ getFieldsValue }) => ({
            validator: () =>
              services.switchStatus({ data: getFieldsValue(), throwErr: true, notify: false }),
          }),
        ]}
      >
        <Radio.Group optionType="button" options={Options(STATUS).toOpt} />
      </Item>
    </ModalForm>
  );
};
