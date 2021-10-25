import { DragSortTable, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useContainer } from '../useStore';
import { PlusOutlined } from '@ant-design/icons';
import XmilesTable from '@/components/Xmiles/ProTable';
import { XmilesCol } from '@/components/Xmiles/Col';
import { list, gameDelete } from '../services';
import styles from '../index.less';

export default (props: any) => {
  const { formRef, actionRef, setModalProps, modalFormRef, setEditRecord } = useContainer(),
    defalutTableColumnsProps: XmilesCol<any> = {
      align: 'left',
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
      title: '类别名称',
      dataIndex: 'name',
      ...defalutTableColumnsProps,
      width: 250,
      hideInSearch: false,
    },
    {
      title: '状态',
      dataIndex: 'showStatus',
      ...defalutTableColumnsProps,
      valueEnum: { 1: '展示', 0: '隐藏' },
      hideInSearch: false,
      align: 'center',
      render: (_, record) => {
        const isStatus = record.showStatus === 1;
        return isStatus ? <Tag color="green">展示</Tag> : <Tag>隐藏</Tag>;
      },
    },
    {
      title: '游戏数量',
      dataIndex: 'num',
      ...defalutTableColumnsProps,
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      ...defalutTableColumnsProps,
      align: 'center',
      sorter: (a, b) => a.sort - b.sort,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defalutTableColumnsProps,
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defalutTableColumnsProps,
      sorter: (a, b) => {
        const aTime = new Date(a.utime).getTime(),
          bTime = new Date(b.utime).getTime();
        return aTime - bTime;
      },
    },
    {
      title: '操作',
      ...defalutTableColumnsProps,
      render: (_, record) => {
        const { id } = record;
        console.log('id', id);
        return (
          <div className={styles.opera}>
            <Button type="link" onClick={() => editHandler(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除吗"
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={async () => {
                await gameDelete({ data: { id } });
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
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
      bordered={false}
      headerTitle={
        <Button type="primary" icon={<PlusOutlined />} onClick={addHandler}>
          新增类别
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
        // const res = await list({ data });
        // return {
        //   data: res?.data?.totalDatas || [],
        //   page: params?.current || 1,
        //   success: true,
        //   total: res?.data?.totalCount || 0,
        // };
        return {
          data: [
            {
              id: 1,
              name: '类型1',
              showStatus: 1,
              num: 12,
              operator: '测试111',
              utime: '2021/10/20',
              sort: 95,
            },
            {
              id: 2,
              name: '类型2',
              showStatus: 0,
              num: 5,
              operator: '测试2',
              utime: '2021/10/25',
              sort: 40,
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
