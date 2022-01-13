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
      title: '新增物理位广告位',
    }));
  }

  const columns: LightTableProColumnProps<Row>[] = [
    {
      title: '广告位ID',
      dataIndex: 'positionId',
    },
  ];

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
            <Dropdown
              trigger={['click', 'hover']}
              mouseLeaveDelay={3}
              overlay={
                <Menu>
                  <Menu.Item key="物理广告位" onClick={addHandler}>
                    物理广告位
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" icon={<PlusOutlined />}>
                广告位
              </Button>
            </Dropdown>
          </Space>
        }
        // manualRequest
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
