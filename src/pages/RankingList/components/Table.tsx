import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import { Button, Image, Modal, Popconfirm, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-table';
import { useContainer } from '../useStore';
import styles from '../index.less';
import RESTful from '@/utils/RESTful';
import { useState, useEffect } from 'react';
import useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';

export default () => {
  const { actionRef, setModalProps, setSelectGame, setEditRecord, setDrawerProps } = useContainer();
  function offline(id: any) {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '移入黑名单，此游戏不再出现在排行榜',
      onOk() {
        // RESTful.post('fxx/game/version/switchStatus', {
        //   data: {
        //     id,
        //   },
        // }).then((res) => {
        //   if (res?.result?.status == 1) {
        //     actionRef?.current?.reload();
        //   }
        // });
      },
      onCancel() {},
    });
  }

  function toBackList() {
    setDrawerProps((pre) => ({ ...pre, visible: true }));
  }

  function editGame(record: any) {
    setModalProps({
      visible: true,
      title: '更换游戏',
    });
    setEditRecord(record);
    setSelectGame([
      {
        icon: record?.gameIcon,
        label: record?.gameName,
        pname: record?.packageName,
        value: record?.gameNum,
      },
    ]);
  }

  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };

  const columns: XmilesCol[] = [
    {
      title: '排行榜排序',
      dataIndex: 'sort',
      width: 60,
      ...defaultTableProps,
    },
    {
      title: '游戏名称',
      dataIndex: 'gameName',
      width: 200,
      ...defaultTableProps,
      hideInSearch: false,
      fieldProps: {
        placeholder: '输入包名/游戏名',
      },
      render: (_, record) => {
        return (
          <Space>
            <Image src={record?.gameIcon} width={40} />
            <span>{record?.gameName}</span>
          </Space>
        );
      },
    },
    {
      title: '游戏包名',
      dataIndex: 'packageName',
      ...defaultTableProps,
    },
    {
      title: '上榜方式',
      dataIndex: 'type',
      valueEnum: { 1: '系统推荐', 2: '人工推荐' },
      ...defaultTableProps,
      hideInSearch: false,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defaultTableProps,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defaultTableProps,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ...defaultTableProps,
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space className={styles.btnSpace}>
            <Button
              type="link"
              onClick={() => {
                editGame(record);
              }}
            >
              更换游戏
            </Button>
            <Popconfirm
              title="移入黑名单，此游戏不再出现在排行榜"
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={async () => {}}
            >
              <Button type="link">移入黑名单</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <XmilesTable
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      columnEmptyText={'-'}
      headerTitle={
        <Button type="primary" onClick={toBackList}>
          排行榜黑名单
        </Button>
      }
      request={async (params) => {
        const data = {
          ...params,
          page: {
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 20,
          },
        };
        const res = await RESTful.post('fxx/game/recommend/list/page', { data });
        return {
          data:
            res?.data?.total_datas?.map((item: any, index: any) => ({
              sort: index + 1 + ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
              ...item,
            })) || [],
          page: params?.current || 1,
          success: true,
          total: res?.data?.total_count || 0,
        };
      }}
    />
  );
};
