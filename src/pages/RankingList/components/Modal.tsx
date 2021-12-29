import { Form, Image, Modal } from 'antd';
import ModalForm from '@/components/ModalForm';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import GameSelect from '@/components/GameSelector';
import RESTful from '@/utils/RESTful';
import isValidValue from '@/utils/isValidValue';

export default () => {
  const { editRecord, modalProps, setModalProps, selectGame, setSelectGame, actionRef } =
    useContainer();
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
      async onOk() {
        if (!isValidValue(selectGame) && editRecord?.type == 1) {
          actionRef?.current?.reload();
          onCancel();
        } else {
          await RESTful.post('fxx/game/recommend/list/saveOrUpdate', {
            data: {
              gameNum: isValidValue(selectGame) ? selectGame?.[0]?.value : editRecord?.gameNum,
              id: editRecord?.type == 2 ? editRecord?.id : undefined,
              status: isValidValue(selectGame) ? 1 : 2,
              type: 2,
              sort: editRecord?.sort,
            },
          }).then((res) => {
            onCancel();
            if (res?.result?.status == 1) {
              actionRef?.current?.reload();
            }
          });
        }
      },
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
