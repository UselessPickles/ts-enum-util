import { Button, Space, Upload, notification, Typography } from 'antd';
import type { UploadProps } from 'antd';

import LightTablePro from '@/EDK/components/LightTablePro';
import type { LightTableProColumnProps } from '@/EDK/components/LightTablePro';
import { PlusOutlined } from '@ant-design/icons';

import type Row from '../models';
import { services } from '../services';
import useLightTablePro from '@/EDK/components/LightTablePro/hook/useLightTablePro';
import useDrawerForm from '@/EDK/components/DrawerForm/useDrawerForm';
import DrawerForm from './Form';
import { config } from '@/utils/RESTful';
import { $enum } from '@/enumUtil/src';
import { PLATFORM } from '../models';

const { Link } = Typography;

export default function () {
  const { actionRef, formRef } = useLightTablePro();

  const drawerFormInstance = useDrawerForm();

  function addHandler() {
    drawerFormInstance.setDrawerProps((pre) => ({
      ...pre,
      visible: true,
      title: '新建',
    }));
  }

  function onEdit(r: Row) {
    return () => {
      drawerFormInstance.setDrawerProps((pre) => ({
        ...pre,
        visible: true,
        title: '关联游戏',
      }));

      drawerFormInstance.setData({ ...r, mode: 'edit' });
    };
  }

  const columns: LightTableProColumnProps<Row>[] = [
    {
      title: '推广计划ID',
      dataIndex: 'popularizePlanId',
    },
    {
      title: '推广平台',
      dataIndex: 'platform',
      valueEnum: $enum(PLATFORM).getMap(),
      width: 100,
    },
    {
      title: '推广计划名称',
      dataIndex: 'popularizePlanName',
      hideInSearch: true,
    },
    {
      title: '关联游戏',
      dataIndex: 'gameNamePkg',
      width: 360,
      fieldProps: { placeholder: '游戏名/包名' },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '操作',
      dataIndex: '_opt',
      hideInSearch: true,
      width: 100,
      fixed: 'right',
      render: (_, row) => {
        return <Link onClick={onEdit(row)}>关联游戏</Link>;
      },
    },
  ];

  function downloadTemplate() {
    window.open(
      `https://game-566.oss-cn-shanghai.aliyuncs.com/${PROCESS_ENV.APP_NAME}/template/promote.${PROCESS_ENV.NODE_ENV}.xlsx`,
    );
  }

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    action: `${config.REQUEST_URL + config.SERVICE}/api/fxx/game/popularize/plan/import`,
    accept:
      '.csv,.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',

    headers: {
      token: localStorage.getItem('token') as string,
    },
    onChange: ({ file }) => {
      if (file?.status === 'done' && file?.response && file?.response?.result?.status === 1) {
        actionRef.current?.reload?.();
        notification.success({
          message: '上传成功',
          description: file.response.data,
        });
      }

      if (file.status === 'error' || file?.response?.result?.status === 0) {
        notification.error({
          message: '上传失败',
          description: file?.response?.result?.msg ?? `文件${file.name}上传失败`,
        });
      }
    },
  };

  function onSuccess() {
    actionRef.current?.reload?.();
  }

  return (
    <>
      <DrawerForm {...drawerFormInstance} onSuccess={onSuccess} />
      <LightTablePro
        size="small"
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        headerTitle={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={addHandler}>
              新增
            </Button>
            <Upload {...uploadProps}>
              <Button>批量添加</Button>
            </Upload>
            <Button type="link" onClick={downloadTemplate}>
              下载模版
            </Button>
          </Space>
        }
        queryOptions={{ refetchOnWindowFocus: false }}
        request={async (params, pagination) => {
          const data = {
            ...params,
            page: {
              page_no: pagination?.current,
              page_size: pagination?.pageSize,
            },
          };
          const res = await services.page({ data });

          return {
            data: res?.data?.total_datas || [],
            page: pagination?.current || 1,
            success: true,
            total: res?.data?.total_count || 0,
          };
        }}
      />
    </>
  );
}
