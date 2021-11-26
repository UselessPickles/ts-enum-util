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
  const [feedbackTypeList, setFeedbackTypeList] = useState<any>();

  async function queryCategory() {
    try {
      const data = (await RESTful.get('fxx/game/feedback/option').then((res) => res?.data)) ?? {};
      const list = data?.reduce((acc, cur) => {
        acc[cur] = cur;
        return acc;
      }, {});
      setFeedbackTypeList(list);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    queryCategory();
  }, []);

  async function handleDownload() {
    const { feedbackType, content, utime } = formRef.current?.getFieldsValue();
    moment.locale('zh-cn');
    const downTime = moment().format('YYYY年MM月DD日 HH时MM分ss秒');
    const res = await request('fxx/game/feedback/exportExcel', {
      method: 'POST',
      responseType: 'arrayBuffer',
      headers: {
        Accept: 'application/vnd.ms-excel,*/*',
      },
      data: {
        startDate: utime?.[0]?.format('YYYY/MM/DD hh:mm:ss'),
        endDate: utime?.[1]?.format('YYYY/MM/DD hh:mm:ss'),
        feedbackType,
        content,
      },
    });
    download(res, '用户反馈' + downTime + '.xlsx', 'application/vnd.ms-excel');
  }

  const columns: XmilesCol[] = [
    {
      title: '问题分类',
      dataIndex: 'feedbackType',
      valueEnum: feedbackTypeList,
      ...defaultTableProps,
      hideInSearch: false,
      width: 180,
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      ...defaultTableProps,
      hideInSearch: false,
      width: 300,
      renderText: (text) => {
        return <div style={{ maxWidth: '500px' }}>{text}</div>;
      },
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      ...defaultTableProps,
      width: 120,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      ...defaultTableProps,
      width: 120,
    },
    {
      title: '所属游戏',
      dataIndex: 'packageOrGameName',
      ...defaultTableProps,
      width: 120,
      render: (_, record) => {
        const gameORapp = record?.packageName ? true : false;
        return gameORapp ? record.gameName + ' ' + record.packageName : 'APP';
      },
    },
    {
      title: '反馈时间',
      dataIndex: 'utime',
      ...defaultTableProps,
      width: 200,
    },
    {
      title: '反馈时间',
      dataIndex: 'utime',
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
        const utime = formRef.current?.getFieldValue('utime');
        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
          startDate: utime?.[0]?.format('YYYY-MM-DD 00:00:00'),
          endDate: utime?.[1]?.format('YYYY-MM-DD 23:59:59'),
          utime: undefined,
        };
        const res = await RESTful.post('fxx/game/feedback/page', { data });
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
