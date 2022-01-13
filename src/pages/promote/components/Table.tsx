import { Button, Space, Dropdown, Menu } from 'antd';

import LightTablePro from '@/EDK/components/LightTablePro';
import type { LightTableProColumnProps } from '@/EDK/components/LightTablePro';
import { PlusOutlined } from '@ant-design/icons';

import type Row from '../models';
import { list } from '../services';
import useLightTablePro from '@/EDK/components/LightTablePro/hook/useLightTablePro';
import useDrawerForm from '@/EDK/components/DrawerForm/useDrawerForm';
import DrawerForm from './Form';

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
            <Button onClick={addHandler}>批量添加</Button>
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
