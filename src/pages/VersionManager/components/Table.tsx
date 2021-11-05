import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-table';
import { useContainer } from '../useStore';
import styles from '../index.less';
import { list } from '../serivces';
import RESTful from '@/utils/RESTful';
import { useState, useEffect } from 'react';

export default () => {
  const { actionRef, setModalProps } = useContainer(),
    [versionOption, setVersionOption] = useState<any>();
  function offline(id: any) {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content:
        '已发布的APP更新包下线后，未更新至此版本的用户不再受到更新提示，已更新至此版本的用户不受影响。',
      onOk() {
        RESTful.post('fxx/game/version/switchStatus', {
          data: {
            id,
          },
        }).then((res) => {
          if (res?.result?.status == 1) {
            actionRef?.current?.reload();
          }
        });
      },
      onCancel() {},
    });
  }

  function uploadHandler() {
    setModalProps({
      visible: true,
      title: '上传新版本',
    });
  }

  async function queryVerion() {
    await RESTful.get('fxx/game/version/option').then((res) => {
      const options = res?.data?.reduce((acc, cur) => {
        acc[cur] = cur;
        return acc;
      }, {});
      setVersionOption(options);
    });
  }

  useEffect(() => {
    queryVerion();
  }, [actionRef]);

  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };

  const columns: XmilesCol[] = [
    {
      title: '版本号',
      dataIndex: 'appVersionCode',
      width: 100,
      align: 'center',
      valueEnum: versionOption,
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
      dataIndex: 'updateType',
      width: 100,
      ...defaultTableProps,
      valueEnum: { 2: '非强制更新', 1: '强制更新' },
      align: 'center',
    },
    {
      title: '更新内容',
      dataIndex: 'content',
      ...defaultTableProps,
      width: 250,
      render: (text) => {
        return <div style={{ whiteSpace: 'pre-line', maxWidth: 400 }}>{text}</div>;
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
          <Button type="link" onClick={() => offline(record?.id)} style={{ padding: 0 }}>
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
        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
        };
        const res = await list({ data });
        return {
          data: res?.data?.total_datas || [],
          page: params?.current || 1,
          success: true,
          total: res?.data?.total_count || 0,
        };
      }}
    />
  );
};
