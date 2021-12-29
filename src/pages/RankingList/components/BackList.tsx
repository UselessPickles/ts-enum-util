import DrawerForm from '@/components/DrawerForm@latest';
import GameTable from '@/components/Xmiles/NoHeadTable';
import { Button, Form, Image, Input, Space, Spin, Popconfirm } from 'antd';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { useEffect, useState } from 'react';
import RESTful from '@/utils/RESTful';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import isValidValue from '@/utils/isValidValue';

export default () => {
  const { setDrawerProps, drawerProps, modalFormRef } = useContainer();
  const [dataSource, setDataSource] = useState<any>(),
    [loading, setLoading] = useState<boolean>(false);
  function onClose() {
    setDrawerProps((pre) => ({ ...pre, visible: false }));
    modalFormRef.resetFields();
  }
  async function queryBackList() {
    setLoading(true);
    const { gameName } = modalFormRef?.getFieldsValue();
    await RESTful.post('fxx/game/blacklist/page', {
      data: {
        type: 3,
        gameName: isValidValue(gameName) ? gameName : undefined,
        page: {
          pageSize: 1000,
          pageNo: 1,
        },
      },
    }).then((res) => {
      setDataSource(res?.data.total_datas);
      setLoading(false);
    });
  }
  useEffect(() => {
    queryBackList();
  }, [drawerProps]);
  const columns = [
    {
      dataIndex: 'gameIcon',
      align: 'left',
      width: 50,
      render: (_: any, record: any) => {
        return <Image src={record?.gameIcon} width={60} />;
      },
    },
    {
      dataIndex: 'gameName',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'packageName',
      align: 'center',
      width: 100,
    },
    {
      width: 100,
      render: (text: any, record: any, index: any) => {
        return (
          <Popconfirm
            title="该操作不可逆,请谨慎操作"
            okText="确定"
            cancelText="取消"
            placement="top"
            onConfirm={async () => {
              RESTful.post('fxx/game/blacklist/update', {
                data: {
                  status: 2,
                  id: record?.id,
                },
              }).then((res) => {
                if (res?.result?.status == 1) {
                  queryBackList();
                }
              });
            }}
          >
            <DeleteOutlined className={styles.delete} style={{ fontSize: 15, color: 'red' }} />
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <DrawerForm
      formProps={{
        form: modalFormRef,
      }}
      drawerProps={{
        ...drawerProps,
        onClose,
        title: '排行榜黑名单',
        footer: <Button onClick={onClose}>取消</Button>,
      }}
    >
      <div className={styles.backTip}>从黑名单移除后，游戏会按排行榜规则正常进入</div>
      <Space>
        <Form.Item label="游戏名称" name="gameName" style={{ marginBottom: 0 }}>
          <Input allowClear />
        </Form.Item>
        <Button type="primary" onClick={queryBackList}>
          搜索
        </Button>
      </Space>
      <div className={styles.backGameDIV}>
        <Spin spinning={loading}>
          <GameTable columns={columns} dataSource={dataSource} rowKey="id" pagination={false} />
        </Spin>
      </div>
    </DrawerForm>
  );
};
