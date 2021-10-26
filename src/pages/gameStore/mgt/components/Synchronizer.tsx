import { message, Modal } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { add } from '../services';
import { DescriptionsRender } from './DescriptionsRender';

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
      content: '上传的游戏将进入自动化测试，测试完成可同步到线上',
      onOk: async () => {
        try {
          setModalProps((pre) => ({ ...pre, confirmLoading: true }));
          await add({
            data: value,
            throwErr: true,
          });
          onSuccess?.();
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

  const map = new Map([
    [0, '上线'],
    [1, '下线'],
  ]);

  const rows = [
    { field: 'status', title: '状态', render: (text) => map.get(text) },
    { field: 'gameName', title: '游戏名称' },
    { field: 'version', title: '版本号' },
    { field: 'description', title: '一句话介绍' },
    { field: 'descriptionDetail', title: '详细介绍' },
  ];

  const dataSource = [
    {
      status: 1,
      gameName: '农药',
      description: '1',
      descriptionDetail:
        '12312312312312312312312312312312312312312312312312312312312312312312312312312312312323',
    },
    {
      status: 0,
      gameName: '农药2',
      version: 'v1.2',
      description: '2',
      // descriptionDetail:'12312312312312312312312312312312312312312312312312312312312312312312312312312312312323',
    },
  ];

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, title: '同步到线上', okText: '确定同步', ...modalProps }}
    >
      <DescriptionsRender bordered dataSource={dataSource} rows={rows} />
    </ModalForm>
  );
};
