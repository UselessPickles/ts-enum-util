import { Form, Image, Modal } from 'antd';
import ModalForm from '@/components/ModalForm';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import GameSelect from '@/components/GameSelector';
import { useState } from 'react';

export default () => {
  const { editRecord, modalProps, setModalProps, selectGame, setSelectGame } = useContainer();
  const [formRef] = Form.useForm();

  function onCancel() {
    formRef?.resetFields();
    setModalProps({
      visible: false,
    });
    setSelectGame([]);
  }
  function onSubmit() {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认保存吗？ 确定后对本次操作保存并更新`,
      async onOk() {},
      onCancel: () => {},
    });
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        form: formRef,
      }}
      modalProps={{ ...modalProps, onOk: onSubmit, onCancel: onCancel }}
    >
      <Form.Item label="游戏名称" name="gameNum">
        <GameSelect
          editRecord={editRecord}
          isEdit={true}
          onSelect={(_, option) => setSelectGame([option])}
        />
      </Form.Item>
      <Form.Item noStyle dependencies={['gameName']}>
        {({}) => {
          const item = selectGame?.[0],
            { icon, label, pname, value } = item ?? {};
          return (
            selectGame?.length > 0 && (
              <div className={styles.GameShow} key={value}>
                <Image src={icon} width={60} />
                <div className={styles.title}>{label}</div>
                <div className={styles.packge}>{pname}</div>
                <DeleteOutlined
                  className={styles.delete}
                  onClick={() => {
                    setSelectGame([]);
                  }}
                />
              </div>
            )
          );
        }}
      </Form.Item>
    </ModalForm>
  );
};
