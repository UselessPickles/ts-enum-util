import { Button, Space, Upload, notification } from 'antd';
import type { UploadProps } from 'antd';

import LightTablePro from '@/EDK/components/LightTablePro';
import type { LightTableProColumnProps } from '@/EDK/components/LightTablePro';
import { PlusOutlined } from '@ant-design/icons';

import type Row from '../models';
import { list } from '../services';
import useLightTablePro from '@/EDK/components/LightTablePro/hook/useLightTablePro';
import useDrawerForm from '@/EDK/components/DrawerForm/useDrawerForm';
import DrawerForm from './Form';
import { config } from '@/utils/RESTful';

export default function () {
  const { actionRef, formRef } = useLightTablePro();

  const DrawerFormInstance = useDrawerForm();

  function addHandler() {
    DrawerFormInstance.setDrawerProps((pre) => ({
      ...pre,
      visible: true,
      title: '新建',
    }));
  }

  const columns: LightTableProColumnProps<Row>[] = [
    {
      title: '广告位ID',
      dataIndex: 'positionId',
    },
  ];

  function downloadTemplate() {
    window.open(
      `https://game-566.oss-cn-shanghai.aliyuncs.com/${PROCESS_ENV.APP_NAME}/${PROCESS_ENV.NODE_ENV}/template/furan.xyz.xlsx`,
    );
  }

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    action: `${config.REQUEST_URL + config.PROJECT_NAME}/api/scenead/ad_id_config/upload`,
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

      if (file.status === 'error') {
        notification.error({
          message: '上传失败',
          description: `文件${file.name}上传失败`,
        });
      }
    },
  };

  return (
    <>
      <DrawerForm {...DrawerFormInstance} />
      <LightTablePro
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
              <Button onClick={addHandler}>批量添加</Button>
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
          const res = await list({ data });

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
