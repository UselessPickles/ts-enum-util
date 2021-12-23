import { Button, Image, InputNumber, Form, DatePicker, Select, Space, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useContainer } from '../useStore';
import XmilesTable from '@/components/Xmiles/ProTable';
import { XmilesCol } from '@/components/Xmiles/Col';
import { list } from '../service';
import styled from 'styled-components';
import styles from '../index.less';
import RESTful from '@/utils/RESTful';

const { RangePicker } = DatePicker;

export default () => {
  const { formRef, actionRef, setModalProps, setEditRecord } = useContainer(),
    [loading, setLoading] = useState<boolean>(false),
    defalutTableColumnsProps: XmilesCol<any> = {
      align: 'left',
      hideInSearch: true,
      renderText: (text: any) => text ?? '-',
    };

  const FormSpace = styled(Space)`
    gap: 0px !important;
    & > div:first-child {
      width: 50%;
    }
    & > div > .ant-form-item {
      margin: 0;
    }
  `;
  const DateRange = styled(RangePicker)`
    padding: 6px 4px 6px 0px;
    & > .ant-picker-range-separator {
      padding: 0 !important;
    }
    & > .ant-picker-active-bar {
      width: 40px !important;
    }
  `;
  const PriorityInput = styled(InputNumber)`
    .ant-input-number-handler-wrap {
      display: none;
    }
  `;

  function detailHandler(record: any) {
    setModalProps({
      visible: true,
      title: '查看详情',
    });
    setEditRecord({ id: record?.id, onOff: false, reviewStatus: record?.reviewStatus });
  }

  useEffect(() => {
    RESTful.post('fxx/game/auto/test/reviewOnOff', {
      data: { onOff: false },
    });
  }, []);

  const testEnum = { 1: '未开始', 2: '测试中', 3: '测试成功', 4: '测试失败' },
    timeType = [
      { label: '入库时间', value: 'ctime' },
      { label: '测试时间', value: 'testTime' },
      { label: '人工审核时间', value: 'reviewTime' },
    ];

  const tableColumns: XmilesCol[] = [
    {
      title: '包名',
      dataIndex: 'packageName',
      ...defalutTableColumnsProps,
    },
    {
      title: 'Icon',
      dataIndex: 'gameIcon',
      ...defalutTableColumnsProps,
      renderText: (src: string) => (
        <Image width="60px" src={'https://game-566.oss-cn-shanghai.aliyuncs.com/' + src} />
      ),
    },
    {
      title: '游戏名',
      dataIndex: 'gameName',
      ...defalutTableColumnsProps,
      hideInSearch: false,
      formItemProps: {
        label: '包名/游戏名',
      },
    },
    {
      title: '测试情况',
      dataIndex: 'testNum',
      ...defalutTableColumnsProps,
      width: 80,
    },
    {
      title: '成功率',
      dataIndex: 'rateOfSuccess',
      ...defalutTableColumnsProps,
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'testStatus',
      ...defalutTableColumnsProps,
      hideInSearch: false,
      valueEnum: testEnum,
      align: 'center',
      render: (text: any, record: any) => {
        const statusStr = testEnum?.[record?.testStatus ?? 1];
        return record?.testStatus == 4 ? (
          <>
            <div>{statusStr}</div>
            <Button
              type="link"
              onClick={async () => {
                await RESTful.post('fxx/game/auto/test/reTesting', {
                  data: { id: record?.id },
                }).then((res) => {
                  if (res?.result?.status == 1) actionRef?.current?.reload();
                });
              }}
            >
              重新测试
            </Button>
          </>
        ) : (
          statusStr
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      ...defalutTableColumnsProps,
      render: (_: any, record: any) => {
        return (
          <PriorityInput
            style={{ width: 60 }}
            min={0}
            max={100}
            stringMode={false}
            value={record.priority}
            disabled={![1, 4].includes(record?.testStatus)}
            onPressEnter={async (e: any) => {
              const input = e.target.value,
                reg = /^[0-9]+$/;
              if (reg.test(input) && input < 100 && input > -1 && input % 1 === 0) {
                setLoading(true);
                await RESTful.post('fxx/game/auto/test/update', {
                  data: { id: record?.id, priority: e.target.value },
                }).then((res) => {
                  if (res?.result?.status == 1) {
                    actionRef?.current?.reload();
                    setLoading(false);
                  }
                });
              } else {
                message.error('优先级填写格式错误');
              }
            }}
          />
        );
      },
    },
    {
      title: '入库时间',
      dataIndex: 'ctime',
      ...defalutTableColumnsProps,
    },
    {
      title: '测试时间',
      dataIndex: 'testTime',
      ...defalutTableColumnsProps,
      width: 120,
    },
    {
      title: '人工审核状态',
      dataIndex: 'reviewStatus',
      valueEnum: { 1: '待审核', 2: '审核通过', 3: '审核不通过' },
      ...defalutTableColumnsProps,
      hideInSearch: false,
      width: 120,
    },
    {
      title: '人工审核时间',
      dataIndex: 'reviewTime',
      ...defalutTableColumnsProps,
      width: 120,
    },
    {
      formItemProps: {
        label: '时间筛选',
        labelCol: { span: 4, offset: 1 },
        wrapperCol: { span: 20 },
      },
      fieldProps: {
        initialValues: { timeType: 'ctime' },
      },
      renderFormItem: () => {
        return (
          <FormSpace>
            <Form.Item name="timeType" initialValue={'ctime'}>
              <Select bordered={false} options={timeType} />
            </Form.Item>
            <Form.Item name="timePick">
              <DateRange className={styles.dateRange} bordered={false} />
            </Form.Item>
          </FormSpace>
        );
      },
      hideInTable: true,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defalutTableColumnsProps,
      width: 80,
    },
    {
      title: '操作',
      ...defalutTableColumnsProps,
      fixed: 'right',
      width: 90,
      render: (_, record) => {
        return (
          <Button type="link" style={{ padding: 0 }} onClick={() => detailHandler(record)}>
            查看详情
          </Button>
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
      loading={loading}
      rowKey="id"
      headerTitle={`当前模式：自动化测试通过 -> 游戏测试库`}
      request={async (params: any) => {
        setLoading(true);
        const timeType = formRef?.current?.getFieldValue('timeType'),
          timePick = formRef?.current?.getFieldValue('timePick'),
          timeStart = `${timeType}Start`,
          timeEnd = `${timeType}End`;

        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
          [timeStart]: timePick?.[0].format('YYYY-MM-DD'),
          [timeEnd]: timePick?.[1].format('YYYY-MM-DD'),
          timeType: timeType == 'ctime' ? 1 : timeType == 'testTime' ? 2 : 3,
          timePick: undefined,
        };
        const res = await list({ data });
        setLoading(false);
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
