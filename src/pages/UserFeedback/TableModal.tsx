import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import RESTful from '@/utils/RESTful';
import { download } from '@/utils/utils';
import { ProColumns } from '@ant-design/pro-table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { Button, Form, FormInstance, Modal, Space, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useRef, useEffect, useState } from 'react';
import request from '@/utils/RESTful';
import ModalForm from '@/components/ModalForm';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getValueFromEvent, str2fileList, uploadEvent2str } from '@/decorators/Format/converter';
import CustomUpload from '@/components/CustomUpload';
import { compose } from '@/decorators/utils';
import { IOC } from '@/decorators/hoc';
import Format from '@/decorators/Format';

export default () => {
  const actionRef = useRef<ProCoreActionType | undefined>(),
    formRef = useRef<FormInstance | undefined>(),
    [modalFormRef] = Form.useForm();
  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };
  const { Item } = Form;
  const [feedbackTypeList, setFeedbackTypeList] = useState<any>();
  const [modalProps, setModalProps] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  async function queryCategory() {
    try {
      const data = (await RESTful.get('fxx/game/feedback/option').then((res) => res?.data)) ?? {};
      const list = data?.reduce((acc: any, cur: any) => {
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

  async function feedbackConfig() {
    setLoading(true);
    const configList =
      (await RESTful.post('fxx/game/user/feedback/setting/list', { data: {} }).finally(() =>
        setLoading(false),
      )) ?? {};
    const configListData = configList?.data?.[0];
    if (configListData?.wechatGroupPicture == '') configListData.wechatGroupPicture = [];
    configListData && modalFormRef?.setFieldsValue(configListData);
    setModalProps({
      title: '反馈信息配置',
      visible: true,
      onCancel: Cancel,
    });
  }
  function Cancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef?.resetFields();
  }

  function submitor() {
    return modalFormRef?.validateFields().then((value) => {
      if (value.qqGroup == '') value.qqKey = '';
      if (Array.isArray(value.wechatGroupPicture) && value.wechatGroupPicture?.length == 0)
        value.wechatGroupPicture = '';
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确认保存吗？二次确认后，保存成功，app相应更新数据',
        async onOk() {
          await RESTful.post('fxx/game/user/feedback/setting/saveOrUpdate', {
            data: { ...(value ?? { qqGroup: '', wechatGroupPicture: '', qqKey: '' }) },
          }).then((res) => {
            if (res?.result?.status == 1) {
              Cancel();
              actionRef.current?.reload();
            }
          });
        },
        onCancel: () => {},
      });
    });
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
    <>
      <XmilesTable<any, any>
        rowKey={'id'}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        loading={loading}
        columnEmptyText={'-'}
        headerTitle={
          <Space>
            <Button type="primary" onClick={handleDownload}>
              导出
            </Button>
            <Button onClick={feedbackConfig}>反馈信息配置</Button>
          </Space>
        }
        request={async (params) => {
          const utime = params.utime;
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
      <ModalForm
        modalProps={{ ...modalProps, onOk: submitor }}
        formProps={{
          form: modalFormRef,
          labelCol: { span: 5 },
          wrapperCol: { span: 16 },
          onFinish: submitor,
        }}
      >
        <Item name="id" hidden></Item>
        <Item label="qq群反馈信息" name="qqGroup">
          <Input />
        </Item>
        <Item noStyle dependencies={['qqGroup']}>
          {({ getFieldValue }) => {
            const qqGroup = getFieldValue('qqGroup');
            return (
              qqGroup && (
                <Item label="qq群key" name="qqKey" rules={[{ required: true }]}>
                  <Input />
                </Item>
              )
            );
          }}
        </Item>
        <Item dependencies={[['wechatGroupPicture']]} noStyle>
          {({ getFieldValue }) => (
            <Item
              name="wechatGroupPicture"
              label="微信群反馈消息"
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              normalize={uploadEvent2str}
            >
              {compose<ReturnType<typeof CustomUpload>>(
                IOC([
                  Format({
                    valuePropName: 'fileList',
                    g: str2fileList,
                  }),
                ]),
              )(
                <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                  {!(getFieldValue(['wechatGroupPicture'])?.length >= 1) && (
                    <div>
                      <PlusOutlined style={{ fontSize: '18px' }} />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </CustomUpload>,
              )}
            </Item>
          )}
        </Item>
      </ModalForm>
    </>
  );
};
