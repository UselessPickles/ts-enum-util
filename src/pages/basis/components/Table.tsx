import { Button, Space, Dropdown, Menu } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';
import type { XmilesCol } from '@/components/Xmiles/Col';
import { PlusOutlined } from '@ant-design/icons';

import type Row from '../models';
import { list } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import ModalForm from './ModalForm';

export default function () {
  const { actionRef, formRef } = useProTable();

  const modalFormInstance = useModalForm();

  function addHandler() {
    modalFormInstance.setModalProps((pre) => ({
      ...pre,
      visible: true,
      title: '新增物理位广告位',
    }));
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '广告位ID',
      dataIndex: 'positionId',
    },
  ];

  return (
    <>
      <ModalForm {...modalFormInstance} />
      <XmilesTable
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
        options={false}
        request={async (params) => {
          const data = {
            ...params,
            page: {
              page_no: params.current,
              page_size: params.pageSize,
            },
          };
          const res = await list(data);

          return {
            data: res?.data?.total_datas || [],
            page: params.current || 1,
            success: true,
            total: res?.data?.total_count || 0,
          };
        }}
      />
    </>
  );
}
