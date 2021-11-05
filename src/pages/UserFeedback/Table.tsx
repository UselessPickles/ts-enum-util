import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import RESTful from '@/utils/RESTful';
import { download } from '@/utils/utils';
import { ProColumns } from '@ant-design/pro-table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { Button, FormInstance } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useRef, useEffect, useState } from 'react';
import request from '@/utils/RESTful';

export default () => {
  const actionRef = useRef<ProCoreActionType | undefined>(),
    formRef = useRef<FormInstance | undefined>();
  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };
  const [categoryList, setCategoryList] = useState<any>();

  async function queryCategory() {
    try {
      const data =
        (await RESTful.post('fxx/game/classify/list', { data: {} }).then((res) => res?.data)) ?? {};
      const category = data?.reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {});
      console.log('category', category);
      setCategoryList(category);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    queryCategory();
  }, []);

  async function handleDownload() {
    moment.locale('zh-cn');
    const downTime = moment().format('YYYY年MM月DD日 HH时MM分ss秒');
    console.log('time', downTime);
    const res = await request('', {
      method: 'POST',
      responseType: 'arrayBuffer',
      headers: {
        Accept: 'application/vnd.ms-excel,*/*',
      },
      data: {},
    });
    download(res, '用户反馈' + downTime + '.xlsx', 'application/vnd.ms-excel');
  }

  const columns: XmilesCol[] = [
    {
      title: '问题分类',
      dataIndex: 'PCategory',
      ...defaultTableProps,
    },
    {
      title: '反馈内容',
      dataIndex: 'feedbackContent',
      ...defaultTableProps,
      hideInSearch: false,
    },
    {
      title: '游戏分类',
      dataIndex: 'gameCategory',
      hideInTable: true,
      valueEnum: categoryList,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      ...defaultTableProps,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      ...defaultTableProps,
    },
    {
      title: '所属游戏',
      dataIndex: 'packageOrGameName',
      ...defaultTableProps,
      render: (_, record) => {
        const gameORapp = record?.packageName ? true : false;
        return gameORapp ? record.gameName + ' ' + record.packageName : 'APP';
      },
    },
    {
      title: '反馈时间',
      dataIndex: 'time',
      ...defaultTableProps,
    },
    {
      title: '反馈时间',
      dataIndex: 'times',
      hideInTable: true,
      valueType: 'dateRange',
      formItemProps: {
        initialValue: [moment().add(0, 'days'), moment().add(0, 'days')],
      },
      fieldProps: {
        disabledDate: (current: any) => {
          return current && current > moment().endOf('day');
        },
      },
    },
  ];

  return (
    <XmilesTable
      rowKey={'id'}
      columns={columns}
      actionRef={actionRef}
      formRef={formRef}
      columnEmptyText={'-'}
      headerTitle={
        <Button type="primary" onClick={handleDownload}>
          导出
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
          data: [{ id: 1, PCategory: '问题1', feedbackContent: '123456' }],
          page: params?.current || 1,
          success: true,
          total: 0,
        };
      }}
    />
  );
};
