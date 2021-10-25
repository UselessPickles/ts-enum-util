import { Form, Select, InputNumber, Radio, Modal } from 'antd';
import { useContainer, useModalFromSubmit } from '../useStore';
import DrawerForm from '@/components/DrawerForm';
import gameImg from '@/assets/img/icon-566game.png';
import styles from '../index.less';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';

const { Item } = Form,
  { Option } = Select,
  { confirm } = Modal;

export default () => {
  const { modalProps, setModalProps, modalFormRef, setEditRecord } = useContainer(),
    { submitor } = useModalFromSubmit(),
    onCancel = () => {
      setModalProps({
        visible: false,
      });
      modalFormRef.resetFields();
      setEditRecord({});
    };

  function onSubmit() {
    const sort = modalFormRef.getFieldValue('sort');
    confirm({
      title: '确认添加游戏吗？',
      icon: <ExclamationCircleOutlined />,
      content: `首页推荐中，第【${sort}】位的游戏将更改为您配置的游戏`,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel,
    });
  }

  return (
    <DrawerForm
      onCancel={onCancel}
      onSubmit={onSubmit}
      modalProps={modalProps}
      formProps={{ layout: 'vertical', form: modalFormRef, className: styles.editForm }}
    >
      <Item label="游戏名称" name="categoryName" rules={[{ required: true }]}>
        <Select optionLabelProp="value" allowClear>
          <Option label="com.xiaomai" value="游戏1" className={styles.Options}>
            <div className={styles.GameOptions}>
              <img src={gameImg} />
              <div className={styles.gameBody}>
                <div>游戏1</div>
                <div className={styles.packge}>com.xiaomai</div>
              </div>
            </div>
          </Option>
        </Select>
      </Item>
      <Item noStyle dependencies={['categoryName']}>
        {({ getFieldValue }) => {
          const categoryName = getFieldValue('categoryName');
          return (
            categoryName && (
              <div className={styles.GameShow}>
                <img src={gameImg} />
                <div className={styles.gameBody}>
                  <div>游戏1</div>
                  <div className={styles.packge}>com.xiaomai</div>
                </div>
              </div>
            )
          );
        }}
      </Item>
      <Item label="展示状态" name="status" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { value: true, label: '展示' },
            { value: false, label: '隐藏' },
          ]}
        />
      </Item>
      <Item noStyle dependencies={['status']}>
        {({ getFieldValue }) => {
          const status = getFieldValue('status');
          return (
            status && (
              <Item
                label={[
                  <>
                    <span>展示位置</span>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: '8px' }}>
                      (可在首页前50个位置中，任意一个位置展示)
                    </span>
                  </>,
                ]}
                name="sort"
                rules={[{ required: true }]}
              >
                <InputNumber
                  max={50}
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入数值0-50"
                />
              </Item>
            )
          );
        }}
      </Item>
    </DrawerForm>
  );
};
