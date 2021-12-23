import DrawerForm from '@/components/DrawerForm@latest';
import GameTable from '@/components/Xmiles/NoHeadTable';
import { Button, Form, Image, Input, Space } from 'antd';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { useEffect, useState } from 'react';
import RESTful from '@/utils/RESTful';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import isValidValue from '@/utils/isValidValue';

export default () => {
  const { setDrawerProps, drawerProps, modalFormRef } = useContainer();
  const [dataSource, setDataSource] = useState<any>(),
    [deleteList, setDeleteList] = useState<any>([]);
  function onClose() {
    setDrawerProps((pre) => ({ ...pre, visible: false }));
    modalFormRef.resetFields();
  }
  async function queryBackList() {
    console.log('delete', deleteList);
    const { gameName } = modalFormRef?.getFieldsValue();
    await RESTful.post('', {
      data: {
        gameName: isValidValue(gameName) ? gameName : undefined,
      },
    });
    const ds = [
      {
        id: 1,
        gameIcon: 'https://game-566.oss-cn-shanghai.aliyuncs.com/icon/1637257082668.png',
        sort: 1,
        gameName: '光·遇',
        type: 1,
        packageName: 'packageName',
        gameNum: '7150',
      },
      {
        id: 2,
        gameIcon: 'https://game-566.oss-cn-shanghai.aliyuncs.com/icon/1637257082668.png',
        sort: 1,
        gameName: '光·遇2',
        type: 1,
        packageName: 'packageName',
        gameNum: '7160',
      },
    ].filter((item) => {
      return !deleteList?.includes(item.id);
    });
    setDataSource(ds);
  }
  useEffect(() => {
    queryBackList();
  }, []);
  const columns = [
    {
      dataIndex: 'gameIcon',
      align: 'left',
      render: (_: any, record: any) => {
        return <Image src={record?.gameIcon} width={60} />;
      },
    },
    {
      dataIndex: 'gameName',
      align: 'center',
    },
    {
      dataIndex: 'packageName',
      align: 'center',
    },
    {
      render: (text: any, record: any, index: any) => {
        return (
          <DeleteOutlined
            className={styles.delete}
            style={{ fontSize: 15 }}
            onClick={() => {
              const dataList = [...dataSource],
                del = [...deleteList];
              del.push(record?.id);
              console.log('del', del);
              dataList.splice(index, 1);
              setDataSource(dataList);
              setDeleteList([...del]);
            }}
          />
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
      <GameTable columns={columns} dataSource={dataSource} rowKey="id" style={{ marginTop: 20 }} />
    </DrawerForm>
  );
};
