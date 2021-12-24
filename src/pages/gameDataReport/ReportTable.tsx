import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import { ProColumns } from '@ant-design/pro-table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { Button, Form, FormInstance, Radio } from 'antd';
import React, { useRef, useState } from 'react';
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined';
import moment from 'moment';
import { download } from '@/utils/utils';
import request from '@/utils/RESTful';
import RESTful from '@/utils/RESTful';
import { useQuery } from 'react-query';

export const RadioOption = [
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

export default () => {
  const actionRef = useRef<ProCoreActionType | undefined>(),
    formRef = useRef<FormInstance | undefined>(),
    defaultTableProps: ProColumns<any> = {
      hideInSearch: true,
      align: 'left',
      sorter: true,
    };
  const [radioDate, setRadioDate] = useState('day'),
    [paramsData, setParamsData] = useState<any>(),
    [orderValue, setOrderValue] = useState<any>();
  const rangesPick = [7, 30, 60, 90, 120].reduce((acc: any, cur: any) => {
    acc[`过去${cur}天`] = [moment().add(-cur, 'days'), moment().add(-1, 'days')];
    return acc;
  }, {});
  const classify = useQuery<{ data: { id: number; name: string }[] }>(
    ['game-dataReport-classify-list'],
    () => RESTful.post(`fxx/game/classify/list`, {}),
  );

  const classifyEnum = classify?.data?.data?.reduce((acc: any, cur: any) => {
    acc[cur.id] = cur.name;
    return acc;
  }, {});

  const columns: XmilesCol[] = [
    {
      title: '时间',
      dataIndex: 'date',
      ...defaultTableProps,
      sorter: false,
      width: radioDate == 'week' ? 150 : 80,
      render: (_, record) => {
        return (
          record?.date ?? (record?.startDate ? `${record?.startDate}~${record?.endDate}` : '-')
        );
      },
    },
    {
      hideInTable: true,
      formItemProps: {
        label: '时间',
        name: 'time',
        initialValue: [moment().add(-1, 'days'), moment().add(-1, 'days')],
      },
      valueType: 'dateRange',
      fieldProps: { ranges: { ...rangesPick } },
    },
    {
      title: 'ID',
      dataIndex: 'gameId',
      ...defaultTableProps,
      sorter: false,
    },
    {
      title: '游戏名',
      dataIndex: 'gameName',
      formItemProps: {
        name: 'gameKeyword',
        label: '游戏',
      },
      fieldProps: {
        placeholder: '请输入ID/包名/游戏名',
      },
      align: 'left',
    },
    {
      title: '包名',
      dataIndex: 'packageName',
      ...defaultTableProps,
      sorter: false,
    },
    {
      title: '分类',
      dataIndex: 'gameClassifyName',
      align: 'left',
      formItemProps: { name: 'gameClassifyId' },
      valueEnum: classifyEnum,
    },
    {
      title: '下载量',
      dataIndex: 'downloadCount',
      ...defaultTableProps,
    },
    {
      title: '新增量',
      dataIndex: 'addCount',
      ...defaultTableProps,
    },
    {
      title: 'DAU',
      dataIndex: 'dau',
      ...defaultTableProps,
    },
    {
      title: '平均时长',
      dataIndex: 'averageDuration',
      ...defaultTableProps,
    },
    {
      title: '新增1日后留存',
      dataIndex: 'addOneRetain',
      ...defaultTableProps,
    },
    {
      title: '新增7日后留存',
      dataIndex: 'addSevenRetain',
      ...defaultTableProps,
    },
    {
      title: '活跃1日后留存',
      dataIndex: 'activeOneRetain',
      ...defaultTableProps,
    },
    {
      title: '活跃7日后留存',
      dataIndex: 'activeSevenRetain',
      ...defaultTableProps,
    },
    {
      title: '崩溃率',
      dataIndex: 'collapseRate',
      ...defaultTableProps,
    },
  ];
  async function handleDownload() {
    moment.locale('zh-cn');
    const res = await request('fxx/game/data/statistics/export', {
      method: 'POST',
      responseType: 'arrayBuffer',
      headers: {
        Accept: 'application/vnd.ms-excel,*/*',
      },
      data: { ...paramsData, page: undefined, pageSize: undefined, current: undefined },
    });
    download(
      res,
      '游戏数据报表' + moment().format('YYYY年MM月DD日 HH时mm分ss秒') + '.xlsx',
      'application/vnd.ms-excel',
    );
  }
  function weekDate(date: any) {
    const week = date?.day() - 1,
      dateFormat = date?.format('YYYY-MM-DD');
    return (
      date &&
      moment(dateFormat)
        ?.add(week == -1 ? -6 : -week, 'days')
        ?.format('YYYY-MM-DD')
    );
  }
  return (
    <XmilesTable
      rowKey="index"
      actionRef={actionRef}
      formRef={formRef}
      columns={columns}
      options={false}
      onChange={(pagination, filters, sorter, extra) => {
        setOrderValue(
          sorter?.order
            ? {
                field: sorter?.field?.replace(/((?<=[a-z])(?=[A-Z]))/g, '_')?.toLowerCase(),
                isAsc: sorter?.order == 'ascend',
              }
            : undefined,
        );
        actionRef?.current?.reload();
      }}
      headerTitle={
        <Radio.Group
          options={RadioOption}
          optionType="button"
          onChange={(e) => {
            setRadioDate(e.target.value);
            actionRef?.current?.reload();
          }}
          defaultValue="day"
        />
      }
      toolBarRender={() => [
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
          导出
        </Button>,
      ]}
      request={async (params) => {
        const format = radioDate == 'month' ? 'YYYY-MM-01' : 'YYYY-MM-DD',
          timePick = formRef?.current?.getFieldValue('time');
        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
          time: undefined,
          startDate: radioDate == 'week' ? weekDate(timePick?.[0]) : timePick?.[0]?.format(format),
          endDate: radioDate == 'week' ? weekDate(timePick?.[1]) : timePick?.[1]?.format(format),
          type: radioDate,
          sortList: orderValue
            ? [{ sortField: orderValue?.field, isAsc: orderValue?.isAsc }]
            : [{ sortField: 'add_count', isAsc: false }],
        };
        setParamsData(data);
        const res = await RESTful.post('fxx/game/data/statistics/page', { data });
        return {
          data: res?.data?.total_datas || [],
          page: params.current || 1,
          success: true,
          total: res?.data?.total_count || 0,
        };
      }}
    />
  );
};
