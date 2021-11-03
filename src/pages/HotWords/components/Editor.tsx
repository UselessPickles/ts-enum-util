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
const { Item } = Form;

export default ({
  data,
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
      content: '上传的游戏将进入自动化测试，测试完成可同步到线上',
      onOk: async () => {
        try {
          setModalProps((pre) => ({ ...pre, confirmLoading: true }));
          await services(
            'save',
            {
              data: value,
              throwErr: true,
            },
            data.env,
          );
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
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="热词名称" label="热词名称" rules={[{ required: true }]}>
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={20} />)}
      </Item>

      <Item name="展示状态" label="展示状态" rules={[{ required: true }]}>
        <Radio.Group optionType="button" options={Options(STATUS).toOpt} />
      </Item>
    </ModalForm>
  );
};
