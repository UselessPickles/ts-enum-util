import type { ReactNode } from 'react';
import type { TabsProps } from 'antd';
import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Button, Space, Dropdown, Menu, Tabs } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';
import { UploadOutlined } from '@ant-design/icons';

import { list } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';
import Uploader from './Uploader';
import { useParams, useHistory } from 'react-router';

const { TabPane } = Tabs;

export default function () {
  const history = useHistory();
  const { actionRef, formRef } = useProTable();

  const uploader = useModalForm({ modalProps: { title: '上传游戏' } });
  const editor = useModalForm();

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

  function editHandler() {
    editor.setModalProps((pre) => ({
      ...pre,
      visible: true,
    }));
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '广告位ID',
      dataIndex: 'positionId',
    },
  ];

  const onTabClick: TabsProps['onTabClick'] = (key) => {
    history.replace(key);
  };

  return (
    <>
      <Tabs activeKey={env} onTabClick={onTabClick}>
        <TabPane tab="测试库" key="test" />
        <TabPane tab="正式库" key="prod" />
      </Tabs>

      <Editor {...editor} />
      <Uploader {...uploader} />

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
            page: {
              page_no: params?.current,
              page_size: params?.pageSize,
            },
          };
          const res = await list({ data });

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
