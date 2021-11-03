import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Space, Image, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import XmilesTable from '@/components/Xmiles/ProTable';

import { services } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';

import { compose } from '@/decorators/utils';
import disabled from '@/decorators/ATag/disabled';
import { useQueryClient } from 'react-query';
import { STATUS } from '../models';

// unsaved test

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useModalForm();

  function addHandler() {
    editor.setModalProps((pre) => ({
      ...pre,
      visible: true,
    }));
  }

  function editHandler(id: Row['id']) {
    return () => {
      editor.setModalProps((pre) => ({
        ...pre,
        visible: true,
      }));
      editor.setData({ id });
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
      title: '搜索热词',
      dataIndex: '搜索热词',
      width: 100,
    },
    {
      title: '展示状态',
      dataIndex: '展示状态',
      width: 100,
      hideInSearch: true,
      valueEnum: STATUS,
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
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 150,
      hideInSearch: true,
      fixed: 'right',
      renderText: (id) => {
        return (
          <Space>
            {compose(disabled(false))(<a onClick={editHandler(id)}>编辑</a>)}
            {compose(disabled(false))(<a onClick={() => {}}>删除</a>)}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Editor {...editor} onSuccess={onSuccess} />

      <XmilesTable
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        headerTitle={
          <Button type="primary" icon={<UploadOutlined />} onClick={addHandler}>
            新增
          </Button>
        }
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
          const res = await services('page', { data });

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
