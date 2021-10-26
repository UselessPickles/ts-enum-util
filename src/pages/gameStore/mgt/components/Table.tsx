import type { ReactNode } from 'react';
import type { TabsProps } from 'antd';
import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Button, Space, Tabs, Image } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';
import { UploadOutlined } from '@ant-design/icons';

import { services } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';
import Uploader from './Uploader';
import Synchronizer from './Synchronizer';
import { useParams, useHistory } from 'react-router';
import { compose } from '@/decorators/utils';
import disabled from '@/decorators/ATag/disabled';
import { STATUS, TEST_STATUS } from '../models';
// unsaved test
const { TabPane } = Tabs;

export default function () {
  const history = useHistory();
  const { actionRef, formRef } = useProTable();

  const uploader = useModalForm({ modalProps: { title: '上传游戏' } });
  const editor = useModalForm();
  const synchronizer = useModalForm();

  const { env } = useParams<{ env: string }>();
  const envBehaviorMap = new Map<string, ReactNode>([
    ['prod', '线上游戏列表'],
    [
      'test',
      <Button type="primary" icon={<UploadOutlined />} onClick={addHandler}>
        上传游戏
      </Button>,
    ],
  ]);

  function addHandler() {
    uploader.setModalProps((pre) => ({
      ...pre,
      visible: true,
    }));
  }

  function editHandler(id: Row['id']) {
    return () => {
      editor.setModalProps((pre) => ({
        ...pre,
        title: '加载中...',
        confirmLoading: true,
        visible: true,
      }));
      editor.setData({ id });
    };
  }

  function syncHandler(id: Row['id']) {
    return () => {
      synchronizer.setModalProps((pre) => ({
        ...pre,
        visible: true,
      }));
      synchronizer.setData({ id });
    };
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '包名/游戏名',
      dataIndex: 'packageOrGameName',
      hideInTable: true,
    },
    {
      title: '包名',
      dataIndex: 'packageName',
      hideInSearch: true,
    },
    {
      title: 'icon',
      dataIndex: 'gameIcon',
      hideInSearch: true,
      renderText: (src) => <Image src={src} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: STATUS,
    },
    {
      title: '自动化测试状态',
      dataIndex: 'testStatus',
      valueEnum: TEST_STATUS,
      hideInSearch: true,
    },
    {
      title: '版本号',
      dataIndex: 'gameVersion',
      hideInSearch: true,
    },
    {
      title: '游戏来源',
      dataIndex: 'gameSource',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'utime',
      valueType: 'dateTimeRange',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'ctime',
      valueType: 'dateTimeRange',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      hideInSearch: true,
      fixed: 'right',
      renderText: (id) => {
        return (
          <Space>
            {compose(disabled(false))(<a onClick={editHandler(id)}>编辑</a>)}
            {compose(disabled(false))(<a onClick={syncHandler(id)}>同步到线上</a>)}
          </Space>
        );
      },
    },
  ];

  const onTabClick: TabsProps['onTabClick'] = (key) => {
    history.replace(key);
    actionRef.current?.reload();
  };

  return (
    <>
      <Tabs activeKey={env} onTabClick={onTabClick}>
        <TabPane tab="测试库" key="test" />
        <TabPane tab="正式库" key="prod" />
      </Tabs>

      <Editor {...editor} />
      <Uploader {...uploader} />
      <Synchronizer {...synchronizer} />

      <XmilesTable
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        headerTitle={envBehaviorMap.get(env)}
        options={false}
        request={async (params) => {
          const data = {
            ...params,
            ustartTime: params?.utime?.[0]?.format('YYYY-MM-DD hh:mm:ss'),
            uendTime: params?.utime?.[1]?.format('YYYY-MM-DD hh:mm:ss'),
            page: {
              page_no: params?.current,
              page_size: params?.pageSize,
            },
          };
          const res = await services('list', { data }, env);

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
