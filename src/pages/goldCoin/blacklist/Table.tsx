import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import RESTful from '@/utils/RESTful';
import { Button, Popconfirm } from 'antd';
import { useContainer } from './useStore';

export default () => {
  const { formRef, setModalProps, actionRef } = useContainer();

  function addList() {
    setModalProps({
      title: '新增',
      visible: true,
    });
  }

  const columns: XmilesCol[] = [
    {
      title: '封禁类型',
      dataIndex: 'type',
      valueEnum: {
        1: '用户ID',
        2: '设备ID',
      },
    },
    {
      title: '封禁用户ID/设备ID',
      dataIndex: 'value',
    },
    {
      title: '封禁形式',
      dataIndex: 'banType',
      valueEnum: {
        1: '手动封禁',
        2: '系统监测封禁',
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'opera',
      hideInSearch: true,
      render: (_: any, record: any) => {
        const isReset = record?.status == 1;
        return isReset ? (
          <Popconfirm
            title="解封用户可以正常提现，确定吗？"
            onConfirm={async () => {
              await RESTful.post('fxx/game/blacklist/update', {
                data: {
                  id: record?.id,
                  status: 2,
                },
              }).then((res) => {
                res?.result?.status == 1 && actionRef?.current?.reload();
              });
            }}
          >
            <Button type="link" style={{ padding: 0 }}>
              解封
            </Button>
          </Popconfirm>
        ) : (
          '-'
        );
      },
    },
  ];

  return (
    <XmilesTable
      actionRef={actionRef}
      formProps={{ labelCol: { offset: 1, span: 8 }, wrapperCol: { span: 15 } }}
      form={formRef}
      columns={columns}
      rowKey="id"
      headerTitle={
        <Button onClick={addList} type="primary">
          新增黑名单
        </Button>
      }
      request={async (params: any) => {
        console.log('params', params);
        const data = {
          ...params,
          page: {
            pageNo: params.current,
            pageSize: params.pageSize,
          },
        };
        const res = await RESTful.post('fxx/game/blacklist/page', { data });
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
