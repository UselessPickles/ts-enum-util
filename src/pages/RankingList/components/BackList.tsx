import DrawerForm from '@/components/DrawerForm@latest';
import GameTable from '@/components/Xmiles/NoHeadTable';
import { Button, Form, Image, Input } from 'antd';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { useEffect } from 'react';
import RESTful from '@/utils/RESTful';

export default () => {
  const { setDrawerProps, drawerProps, modalFormRef } = useContainer();

  function onClose() {
    setDrawerProps((pre) => ({ ...pre, visible: false }));
    modalFormRef.resetFields();
  }
  async function queryBackList() {
    await RESTful.post('', {
      data: {
        gameName: modalFormRef?.getFieldValue('gameName'),
      },
    });
  }
  useEffect(() => {
    queryBackList();
  }, []);
  const columns = [
    {
      dataIndex: 'gameIcon',
      align: 'center',
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
  ];
  return (
    <DrawerForm
      drawerProps={{
        ...drawerProps,
        onClose,
        title: '排行榜黑名单',
      }}
    >
      <div className={styles.backTip}>从黑名单移除后，游戏会按排行榜规则正常进入</div>
      <Form layout="inline" form={modalFormRef}>
        <Form.Item label="游戏名称" name="gameName">
          <Input allowClear />
        </Form.Item>
        <Button type="primary" onClick={queryBackList}>
          搜索
        </Button>
      </Form>
      <GameTable
        columns={columns}
        //  dataSource={}
      />
    </DrawerForm>
  );
};
