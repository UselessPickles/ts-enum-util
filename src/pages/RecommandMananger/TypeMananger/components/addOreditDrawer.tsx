import { Button, Form, Input, InputNumber, Radio, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useContainer, useModalFromSubmit } from '../useStore';
import { EditOutlined } from '@ant-design/icons';
import styles from '../index.less';
import DrawerForm from '@/components/DrawerForm';
import { listDetail, check } from '../services';
import GameTable from '@/components/Xmiles/NoHeadTable';
const { Item } = Form;

export default () => {
  const {
      modalProps,
      modalFormRef,
      editRecord,
      setGameModalProps,
      checkedGames,
      setCheckedGames,
      setSelectRowKeys,
      setPage,
      loading,
      setLoading,
    } = useContainer(),
    { submitor, onCancel } = useModalFromSubmit(),
    onOpenGame = () => {
      setPage(1);
      setGameModalProps({
        visible: true,
        title: '编辑游戏名单',
      });
    };

  async function queryGameDetail() {
    const { id } = editRecord ?? {};
    try {
      setLoading(true);
      const res = await listDetail({
        data: { id },
      });
      const details = res?.data?.details;
      if (details?.length > 0) {
        const sortDetails = details?.sort((a, b) => a['sort'] - b['sort']);
        setCheckedGames(sortDetails);
        const rowKeys = sortDetails?.reduce((acc, cur) => (acc = [...acc, cur?.gameNum]), []);
        setSelectRowKeys(rowKeys);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    modalProps.title == '编辑' && queryGameDetail();
  }, [modalProps]);

  const columns = [
    {
      dataIndex: 'sort',
      align: 'center',
      with: 100,
      render: (_: any, record: any) => {
        return <div className={styles.gameIndex}>{record?.sort}</div>;
      },
    },
    {
      dataIndex: 'gameIcon',
      render: (_: any, record: any) => {
        return <img src={record?.gameIcon} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 680,
      render: (_: any, record: any) => {
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
      onSubmit={submitor}
      modalProps={{ ...modalProps, zIndex: 10 }}
      formProps={{
        layout: 'vertical',
        form: modalFormRef,
        className: styles.editForm,
        initialValues: { showStatus: 1 },
      }}
    >
      <h3>1.基础信息 </h3>
      <Item label="类别名称" name="name" rules={[{ required: true }]}>
        <Input maxLength={10} />
      </Item>
      <Item label="展示状态" name="showStatus" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { value: 1, label: '展示' },
            { value: 0, label: '隐藏' },
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
        rules={[
          { required: true },
          ({ getFieldValue }) => {
            const name = getFieldValue('name');
            return {
              async validator(_, sort) {
                try {
                  await check({
                    data: {
                      id: editRecord.id,
                      name,
                      sort,
                    },
                    throwErr: true,
                  });
                  return Promise.resolve();
                } catch (e) {
                  return Promise.reject(e);
                }
              },
            };
          },
        ]}
      >
        <InputNumber max={999} min={1} style={{ width: '100%' }} placeholder="请输入数值0-999" />
      </Item>
      <h3>2.游戏名单</h3>
      <Button onClick={onOpenGame} icon={<EditOutlined />} className={styles.btnDefaut}>
        编辑游戏名单
      </Button>
      <Spin spinning={loading} tip="Loading..." style={{ height: 400 }}>
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
      </Spin>
    </DrawerForm>
  );
};
