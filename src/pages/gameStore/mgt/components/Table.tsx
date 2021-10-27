import type { ReactNode } from 'react';
import type { TabsProps } from 'antd';
import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Button, Space, Tabs, Image, Modal } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';
import { UploadOutlined } from '@ant-design/icons';

import { services } from '../services';
import { services as syncServices } from '../services/sync';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';
import Uploader from './Uploader';
import Synchronizer from './Synchronizer';
import { useParams, useHistory } from 'react-router';
import { compose } from '@/decorators/utils';
import disabled from '@/decorators/ATag/disabled';
import { STATUS, TEST_STATUS } from '../models';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
// unsaved test
const { TabPane } = Tabs;

const TabBackground = styled(Tabs)`
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  .ant-tabs-nav {
    margin: 0;
    padding: 0 16px;
  }
`;

export default function () {
  const history = useHistory();
  const { actionRef, formRef } = useProTable();
  const client = useQueryClient();

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

    uploader.setData({ env });
  }

  function editHandler(id: Row['id']) {
    return () => {
      client.invalidateQueries(['game-mgt-editor', id]);
      editor.setModalProps((pre) => ({
        ...pre,
        title: '加载中...',
        confirmLoading: true,
        visible: true,
      }));
      editor.setData({ id, env });
    };
  }

  function sync2line(id: string) {
    return syncServices('save', { data: { id }, throwErr: true });
  }

  function syncConfirm(id: string, first = true) {
    return Modal.confirm({
      title: '确认同步游戏一线上吗？',
      content: `${first ? '该游戏为新游戏，线上无旧版本' : '请核实无误'}，确定同步后将上线`,
      onOk: () => sync2line(id),
    });
  }

  function syncHandler(id: Row['id']) {
    return async () => {
      const dataSource =
        (await syncServices('get', { data: { id } }).then((res: any) => res?.data)) ?? [];
      if (dataSource?.length > 1) {
        synchronizer.setModalProps((pre) => ({
          ...pre,
          visible: true,
          onOk: () => syncConfirm(id, false),
        }));

        synchronizer.setFormProps((pre) => ({
          ...pre,
          onFinish: () => syncConfirm(id, false),
        }));

        synchronizer.setData({ dataSource });
      } else {
        syncConfirm(id);
      }
    };
  }

  function onSuccess() {
    tableReload();
  }

  function tableReload() {
    actionRef.current?.reload();
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '包名/游戏名',
      dataIndex: 'packageOrGameName',
      width: 100,
      hideInTable: true,
    },
    {
      title: '包名',
      dataIndex: 'packageName',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'icon',
      dataIndex: 'gameIcon',
      width: 100,
      hideInSearch: true,
      renderText: (src) => <Image width="60px" src={src} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: STATUS,
    },
    {
      title: '自动化测试状态',
      dataIndex: 'testStatus',
      width: 100,
      valueEnum: TEST_STATUS,
      hideInSearch: true,
    },
    {
      title: '版本号',
      dataIndex: 'gameVersion',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '游戏来源',
      dataIndex: 'gameSource',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'utime',
      width: 100,
      valueType: 'dateTimeRange',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'ctime',
      width: 100,
      valueType: 'dateTimeRange',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 100,
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
    tableReload();
  };

  return (
    <>
      <TabBackground activeKey={env} onTabClick={onTabClick}>
        <TabPane tab="测试库" key="test" />
        <TabPane tab="正式库" key="prod" />
      </TabBackground>

      <Editor {...editor} onSuccess={onSuccess} />
      <Uploader {...uploader} onSuccess={onSuccess} />
      <Synchronizer {...synchronizer} onSuccess={onSuccess} />

      <div style={{ marginTop: 'calc(48px)' }}>
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
                pageNo: params?.current,
                pageSize: params?.pageSize,
              },
            };
            const res = await services('page', { data }, env);

            return {
              data: res?.data?.total_datas || [],
              page: params.current || 1,
              success: true,
              total: res?.data?.total_count || 0,
            };
          }}
        />
      </div>
    </>
  );
}
