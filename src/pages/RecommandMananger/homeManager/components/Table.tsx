import { DragSortTable, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useContainer } from '../useStore';
import { PlusOutlined } from '@ant-design/icons';
import XmilesTable from '@/components/Xmiles/ProTable';
import { XmilesCol } from '@/components/Xmiles/Col';
import { list } from '../services';

export default (props: any) => {
  const { formRef, actionRef, setModalProps, modalFormRef, setEditRecord } = useContainer(),
    defalutTableColumnsProps: XmilesCol<any> = {
      align: 'center',
      hideInSearch: true,
      renderText: (text) => text ?? '-',
    };

  function addHandler() {
    setModalProps({
      visible: true,
      title: '新增',
    });
    modalFormRef.resetFields();
  }

  async function editHandler(record: any) {
    setModalProps({
      visible: true,
      title: '编辑',
    });
    modalFormRef.setFieldsValue(record);
    setEditRecord(record);
  }

  const tableColumns: XmilesCol[] = [
    {
      title: '游戏名称',
      dataIndex: 'gameName',
      ...defalutTableColumnsProps,
      hideInSearch: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ...defalutTableColumnsProps,
      renderText: (text) => (text ? <Tag color="green">展示</Tag> : <Tag>隐藏</Tag>),
    },
    {
      title: '展示位置',
      dataIndex: 'sort',
      ...defalutTableColumnsProps,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defalutTableColumnsProps,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defalutTableColumnsProps,
    },
    {
      title: '操作',
      ...defalutTableColumnsProps,
      render: (_, record) => {
        return (
          <>
            <Button type="link" onClick={() => editHandler(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除吗"
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={() => {}}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <XmilesTable
      actionRef={actionRef}
      formRef={formRef}
      columns={tableColumns}
      options={false}
      bordered
      headerTitle={
        <Button type="primary" icon={<PlusOutlined />} onClick={addHandler}>
          新增推荐游戏
        </Button>
      }
      request={async (params) => {
        const data = {
          ...params,
          page: {
            page_no: params.current,
            page_size: params.pageSize,
          },
        };
        // const res = await list({ data });
        // return {
        //   data: res?.data?.total_datas || [],
        //   page: params?.current || 1,
        //   success: true,
        //   total: res?.data?.total_count || 0,
        // };
        return {
          data: [
            {
              categoryName: '类型1',
              status: true,
              num: 12,
              operator: '测试111',
              utime: '2021/10/20',
            },
          ],
          page: params?.current || 1,
          success: true,
          total: 1,
        };
      }}
    />
  );
};
