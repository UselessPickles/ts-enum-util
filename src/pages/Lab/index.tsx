import type { XmilesCol } from '@/components/Xmiles/Col';
import { Space } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';

import Table from './components/Table';

import useProTable from '@/components/Xmiles/ProTable/useProTable';

import useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import RESTful from '@/utils/RESTful';

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useDrawerForm();

  function onSuccess() {
    tableReload();
  }

  function tableReload() {
    actionRef.current?.reload();
  }

  const columns: XmilesCol<any>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: new Map([
        [1, '启用'],
        [2, '禁用'],
      ]),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      hideInSearch: true,
      width: 150,
      fixed: 'right',
    },
  ];

  return (
    <Space direction="vertical">
      <XmilesTable
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        options={false}
        request={async (params) => {
          const data = {
            ...params,
            ustartTime: params?.utime?.[0]?.format('YYYY-MM-DD hh:mm:ss'),
            uendTime: params?.utime?.[1]?.format('YYYY-MM-DD hh:mm:ss'),
            page: {
              pageNo: params?.current,
              pageSize: params?.pageSize,
            },
          };
          const res = await RESTful.post(`fxx/game/coin/task/page`, { data });

          return {
            data: res?.data?.total_datas ?? [],
            page: params.current ?? 1,
            success: true,
            total: res?.data?.total_count ?? 0,
          };
        }}
      />

      <Table
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        options={false}
        request={async (params) => {
          const data = {
            ...params,
            ustartTime: params?.utime?.[0]?.format('YYYY-MM-DD hh:mm:ss'),
            uendTime: params?.utime?.[1]?.format('YYYY-MM-DD hh:mm:ss'),
            page: {
              pageNo: params?.current,
              pageSize: params?.pageSize,
            },
          };
          const res = await RESTful.post(`fxx/game/coin/task/page`, { data });

          return {
            data: res?.data?.total_datas ?? [],
            page: params.current ?? 1,
            success: true,
            total: res?.data?.total_count ?? 0,
          };
        }}
      />
    </Space>
  );
}
