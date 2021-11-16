import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import RESTful from '@/utils/RESTful';
import { Button } from 'antd';
import { useContainer } from './useStore';

export default () => {
  const { formRef, setModalProps } = useContainer();

  function addList() {
    setModalProps({
      title: '新增',
      visible: true,
    });
  }
  async function unseal(record: any) {
    await RESTful.post('', {
      data: {},
    });
  }

  const columns: XmilesCol[] = [
    {
      title: '封禁类型',
      name: 'type',
      valueEnum: {
        userID: '用户ID',
        deviceId: '设备ID',
      },
    },
    {
      title: '封禁用户ID/设备ID',
      name: 'ID',
    },
    {
      title: '封禁形式',
      name: 'form',
      valueEnum: {
        0: '手动封禁',
        1: '系统监测封禁',
      },
    },
    {
      title: '操作人',
      name: 'operator',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      name: 'utime',
      hideInSearch: true,
    },
    {
      title: '操作',
      name: 'opera',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return (
          <Button type="link" onClick={unseal(record)} style={{ padding: 0 }}>
            解封
          </Button>
        );
      },
    },
  ];

  return (
    <XmilesTable
      form={formRef}
      columns={columns}
      headerTitle={
        <Button onClick={addList} type="primary">
          新增黑名单
        </Button>
      }
      request={async (params) => {
        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
        };
        // const res = await list({ data });
        // return {
        //   data: res?.data?.total_datas || [],
        //   page: params?.current || 1,
        //   success: true,
        //   total: res?.data?.total_count || 0,
        // };
        return {
          data: [{}],
          page: 1,
          success: true,
          total: 1,
        };
      }}
    />
  );
};
