import { Button, Form, Input, InputNumber, Radio } from 'antd';
import React from 'react';
import { gameTable, useContainer, useModalFromSubmit } from '../useStore';
import { EditOutlined } from '@ant-design/icons';
import styles from '../index.less';
import DrawerForm from '@/components/DrawerForm';
import gameImg from '@/assets/img/icon-566game.png';

const { Item } = Form;

export default () => {
  const {
      modalProps,
      setModalProps,
      modalFormRef,
      setEditRecord,
      setGameModalProps,
      checkedGames,
    } = useContainer(),
    { GameTable } = gameTable(),
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

  const columns = [
    {
      dataIndex: 'index',
      align: 'center',
      with: 100,
      render: (text, record, index) => {
        return <div className={styles.gameIndex}>{index + 1}</div>;
      },
    },
    {
      dataIndex: 'icon',
      render: () => {
        return <img src={gameImg} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 680,
      render: (text: any, record: any, index: any) => {
        return (
          <div className={styles.gameClass}>
            <h5>{record?.gameName}</h5>
            <p>{record?.packageName}</p>
          </div>
        );
      },
    },
  ];

  return (
    <DrawerForm
      onCancel={onCancel}
      onSubmit={onCancel}
      modalProps={modalProps}
      formProps={{ layout: 'vertical', form: modalFormRef, className: styles.editForm }}
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
        label={[
          <>
            <span>排序</span>
            <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: '8px' }}>
              (在APP页面上的排序位置,数字越大越靠前)
            </span>
          </>,
        ]}
        name="sort"
        rules={[{ required: true }]}
      >
        <InputNumber max={999} min={1} style={{ width: '100%' }} placeholder="请输入数值0-999" />
      </Item>
      <h3>2.游戏名单</h3>
      <Button onClick={onOpenGame} icon={<EditOutlined />} className={styles.btnDefaut}>
        编辑游戏名单
      </Button>
      <Item noStyle shouldUpdate>
        {({}) => {
          return (
            checkedGames?.length > 0 && (
              <div className={styles.showGameDIV}>
                <GameTable
                  columns={columns}
                  dataSource={checkedGames}
                  pagination={false}
                  size="small"
                />
              </div>
            )
          );
        }}
      </Item>
    </DrawerForm>
  );
};
