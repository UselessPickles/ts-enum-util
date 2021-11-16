import { Button, Popconfirm, Tag, Modal } from 'antd';
import { useContainer } from '../useStore';
import { PlusOutlined } from '@ant-design/icons';
import XmilesTable from '@/components/Xmiles/ProTable';
import { XmilesCol } from '@/components/Xmiles/Col';
import { deleteGame, list } from '../services';
import RESTful from '@/utils/RESTful';
import styles from '../index.less';

export default () => {
  const { formRef, actionRef, setModalProps, modalFormRef, setEditRecord, setSelectGame } =
      useContainer(),
    defalutTableColumnsProps: XmilesCol<any> = {
      align: 'left',
      hideInSearch: true,
      renderText: (text) => text ?? '-',
    };

  async function addHandler() {
    const status = await RESTful.post('fxx/game/index/check', {
      data: {},
      notify: false,
      throwErr: true,
    }).then((res) => res?.result?.status);
    if (status == 0) {
      Modal.error({
        title: '已达上限，不能新增游戏',
        content: '线上最多可配置10个游戏展示，已达到最大值，无法再新增',
      });
    } else {
      setModalProps({
        visible: true,
        title: '新增',
      });
      modalFormRef.resetFields();
    }
  }

  async function editHandler(record: any) {
    setModalProps({
      visible: true,
      title: '编辑',
    });
    modalFormRef.setFieldsValue(record);
    setEditRecord({ ...record, gameIcon: record?.icon });
    setSelectGame([
      {
        icon: record?.icon,
        label: record?.gameName,
        pname: record?.packageName,
        value: record?.gameNum,
      },
    ]);
  }

  const tableColumns: XmilesCol[] = [
    {
      title: '游戏名称',
      dataIndex: 'gameName',
      ...defalutTableColumnsProps,
      hideInSearch: false,
      className: styles.tdWidth,
    },
    {
      title: '状态',
      dataIndex: 'showStatus',
      ...defalutTableColumnsProps,
      align: 'center',
      render: (_, record) => {
        const isStatus = record.showStatus === 1;
        return (
          <Tag style={{ margin: 0 }} color={isStatus ? 'green' : 'default'}>
            {isStatus ? '展示' : '隐藏'}
          </Tag>
        );
      },
    },
    {
      title: '展示位置',
      dataIndex: 'sort',
      ...defalutTableColumnsProps,
      align: 'center',
      className: styles.tdWidth,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      ...defalutTableColumnsProps,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      ...defalutTableColumnsProps,
    },
    {
      title: '操作',
      width: 160,
      ...defalutTableColumnsProps,
      fixed: 'right',
      render: (_, record) => {
        const { id } = record;
        return (
          <>
            <Button
              type="link"
              onClick={() => editHandler(record)}
              style={{ padding: 0, marginRight: 10 }}
            >
              编辑
            </Button>
            <Popconfirm
              title="此位置游戏将由算法补齐，确定删除吗"
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={async () => {
                try {
                  await deleteGame({ data: { id } }).then((res) => {
                    res?.result?.status == 1 && actionRef?.current?.reload();
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <Button type="link" style={{ padding: 0 }}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <XmilesTable
      rowKey={'id'}
      actionRef={actionRef}
      formRef={formRef}
      columns={tableColumns}
      options={false}
      bordered
      headerTitle={
        <Button type="primary" icon={<PlusOutlined />} onClick={addHandler}>
          新增推荐游戏
        </Button>
      }
      request={async (params) => {
        const data = {
          ...params,
          page: {
            page_no: params.current,
            page_size: params.pageSize,
          },
        };
        const res = await list({ data });
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
