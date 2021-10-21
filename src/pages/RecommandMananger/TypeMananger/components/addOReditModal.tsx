import { Button, Form, Input, InputNumber, Modal, Radio } from 'antd';
import React from 'react';
import ModalForm from '@/components/ModalForm';
import { useContainer, useModalFromSubmit } from '../useStore';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import styles from '../index.less';

const { Item } = Form;

export default () => {
  const {
      modalProps,
      setModalProps,
      modalFormRef,
      setEditRecord,
      setGameModalProps,
    } = useContainer(),
    { submitor } = useModalFromSubmit(),
    onCancel = () => {
      setModalProps({
        visible: false,
      });
      modalFormRef.resetFields();
      setEditRecord({});
    },
    onOpenGame = () => {
      setGameModalProps({
        visible: true,
        title: '编辑游戏名单',
      });
    };

  return (
    <ModalForm
      formProps={{ layout: 'vertical', form: modalFormRef, className: styles.editForm }}
      modalProps={{ ...modalProps, onCancel }}
      //onOk: submitor,
    >
      <h3>1.基础信息 </h3>
      <Item label="类别名称" name="categoryName" rules={[{ required: true }]}>
        <Input maxLength={10} />
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
      <Item
        label="排序"
        name="sort"
        rules={[{ required: true }]}
        extra="在APP页面上的排序位置,数字越大越靠前"
      >
        <InputNumber max={999} min={1} style={{ width: '100%' }} placeholder="请输入数值0-999" />
      </Item>
      <h3>2.游戏名单</h3>
      <Button onClick={onOpenGame} icon={<EditOutlined color="#1B73E8" />}>
        查看
      </Button>
      {/* <Item label="游戏名单" required={true}>

      </Item> */}
    </ModalForm>
  );
};
