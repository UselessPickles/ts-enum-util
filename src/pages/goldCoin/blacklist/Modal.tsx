import { useContainer } from './useStore';
import { Form, Input, Modal } from 'antd';
import RESTful from '@/utils/RESTful';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Item } = Form,
  { confirm } = Modal;

export default () => {
  const { modalProps, modalFormRef, setModalProps } = useContainer();
  async function onSubmit() {
    const value = await modalFormRef.validateFields();
    if (value.deviceId || value.userID) {
      confirm({
        title: '确认新增封禁吗？',
        icon: <ExclamationCircleOutlined />,
        content: `封禁后不再下发金币、无法提现，确定吗？`,
        async onOk() {
          try {
            await RESTful.post('', {
              data: {},
            }).then((res) => {
              if (res?.result?.status == 1) {
                setModalProps({
                  visible: false,
                });
              }
            });
          } catch (e) {
            console.log(e);
          }
        },
        onCancel,
      });
    } else {
      Modal.error({ title: '未检测到输入内容，请填写' });
    }
  }
  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
  }

  return (
    <Modal {...modalProps} onOk={onSubmit} onCancel={onCancel} width={450}>
      <div style={{ position: 'absolute', top: 65, color: 'grey' }}>二项全部输入即二项全部封禁</div>
      <Form
        form={modalFormRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        style={{ marginTop: 20 }}
      >
        <Item name="userID" label="用户ID">
          <Input />
        </Item>
        <Item name="deviceId" label="设备ID">
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};
