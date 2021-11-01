import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-table';
import { useContainer } from '../useStore';
import styles from '../index.less';

export default () => {
  const { actionRef, setModalProps } = useContainer();
  function offline() {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content:
        '已发布的APP更新包下线后，未更新至此版本的用户不再受到更新提示，已更新至此版本的用户不受影响。',
      onOk() {},
      onCancel() {},
    });
  }

  function uploadHandler() {
    setModalProps({
      visible: true,
      title: '上传新版本',
    });
  }

  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };

  const columns: XmilesCol[] = [
    {
      title: '版本号',
      dataIndex: 'version',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        const isNew = record?.status == 1 && index == 0;
        return isNew ? (
          <>
            <div className={styles.versionTag}>当前更新版本</div>
            <div style={{ lineHeight: '50px' }}>{text}</div>
          </>
        ) : (
          text
        );
      },
    },
    {
      title: '更新方式',
      dataIndex: 'updateWay',
      width: 100,
      ...defaultTableProps,
      valueEnum: { 0: '非强制更新', 1: '强制更新' },
      align: 'center',
    },
    {
      title: '更新内容',
      dataIndex: 'updateContent',
      ...defaultTableProps,
      width: 250,
      render: (text) => {
        return <div style={{ whiteSpace: 'pre-line' }}>{text}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      ...defaultTableProps,
      valueEnum: { 0: '下线', 1: '已发布' },
      width: 100,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defaultTableProps,
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defaultTableProps,
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'opertion',
      ...defaultTableProps,
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const isPublished = record?.status == 1;
        return isPublished ? (
          <Button type="link" onClick={offline} style={{ padding: 0 }}>
            下线
          </Button>
        ) : (
          '-'
        );
      },
    },
  ];

  return (
    <XmilesTable
      rowKey={'id'}
      actionRef={actionRef}
      columns={columns}
      columnEmptyText={'-'}
      headerTitle={
        <Button type="primary" onClick={uploadHandler} icon={<UploadOutlined />}>
          上传新版本
        </Button>
      }
      request={async (params) => {
        // const data = {
        //   ...params,
        //   page: {
        //     pageNo: params.current,
        //     pageSize: params.pageSize,
        //   },
        // };
        // const res = await list({ data });
        return {
          data: [
            { id: 1, version: 'v1.1', updateWay: 0, updateContent: '1.ddd', status: 1 },
            {
              id: 2,
              version: 'v0.2',
              updateWay: 1,
              updateContent: '1.内容1\n2.内容2\n3.内容3',
              status: 1,
            },
          ],
          page: params?.current || 1,
          success: true,
          total: 0,
        };
      }}
    />
  );
};
