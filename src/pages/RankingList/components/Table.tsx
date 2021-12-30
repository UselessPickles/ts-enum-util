import { XmilesCol } from '@/components/Xmiles/Col';
import XmilesTable from '@/components/Xmiles/ProTable';
import { Button, Image, Popconfirm, Space } from 'antd';
import { ProColumns } from '@ant-design/pro-table';
import { useContainer } from '../useStore';
import styles from '../index.less';
import RESTful from '@/utils/RESTful';

export default () => {
  const { actionRef, setModalProps, setSelectGame, setEditRecord, setDrawerProps } = useContainer();

  function toBackList() {
    setDrawerProps((pre) => ({ ...pre, visible: true }));
  }

  function editGame(record: any) {
    setModalProps({
      visible: true,
      title: '更换游戏',
    });
    setEditRecord(record);
    record?.type == 2 &&
      setSelectGame([
        {
          icon: record?.gameIcon,
          label: record?.gameName,
          pname: record?.packageName,
          value: record?.gameNum,
        },
      ]);
  }

  const defaultTableProps: ProColumns<any> = {
    hideInSearch: true,
    align: 'left',
  };

  const columns: XmilesCol[] = [
    {
      title: '排行榜排序',
      dataIndex: 'sort',
      width: 60,
      ...defaultTableProps,
    },
    {
      title: '游戏名称',
      dataIndex: 'gameName',
      width: 200,
      ...defaultTableProps,
      hideInSearch: false,
      fieldProps: {
        placeholder: '输入包名/游戏名',
      },
      render: (_, record) => {
        return (
          <Space>
            <Image src={record?.gameIcon} width={40} />
            <span>{record?.gameName}</span>
          </Space>
        );
      },
    },
    {
      title: '游戏包名',
      dataIndex: 'packageName',
      ...defaultTableProps,
    },
    {
      title: '上榜方式',
      dataIndex: 'type',
      valueEnum: { 1: '系统推荐', 2: '人工推荐' },
      ...defaultTableProps,
      hideInSearch: false,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defaultTableProps,
      renderText: (text, record) => {
        return record?.type == 2 ? text : '-';
      },
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defaultTableProps,
      renderText: (text, record) => {
        return record?.type == 2 ? text : '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      ...defaultTableProps,
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space className={styles.btnSpace}>
            <Button
              type="link"
              onClick={() => {
                editGame(record);
              }}
            >
              更换游戏
            </Button>
            <Popconfirm
              title="移入黑名单，此游戏不再出现在排行榜"
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={() => {
                RESTful.post('fxx/game/blacklist/batch/save', {
                  data: [
                    {
                      banType: 1,
                      type: 3,
                      value: record?.gameNum,
                    },
                  ],
                }).then((res) => {
                  RESTful.post('fxx/game/recommend/list/saveOrUpdate', {
                    data: {
                      gameNum: record?.gameNum,
                      id: record?.type == 2 ? record?.id : undefined,
                      status: 2,
                      type: 2,
                      sort: record?.sort,
                    },
                  }).then((res) => {
                    if (res?.result?.status == 1) {
                      actionRef?.current?.reload();
                    }
                  });
                });
              }}
            >
              <Button type="link">移入黑名单</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <XmilesTable
      actionRef={actionRef}
      columns={columns}
      columnEmptyText={'-'}
      hiddenSearch={true}
      headerTitle={
        <Button type="primary" onClick={toBackList}>
          排行榜黑名单
        </Button>
      }
      options={false}
      request={async (params) => {
        const data = {
          ...params,
          page: {
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 20,
          },
        };
        const res = await RESTful.post('fxx/game/recommend/list/page', { data });
        const dataList = res?.data?.total_datas?.map((item: any, index: any) => ({
          sort: index + 1 + ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
          ...item,
        }));
        return {
          data: dataList || [],
          page: params?.current || 1,
          success: true,
          total: res?.data?.total_count || 0,
        };
      }}
    />
  );
};
