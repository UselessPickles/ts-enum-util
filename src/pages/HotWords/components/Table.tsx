import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Space, Button, Popconfirm, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import XmilesTable from '@/components/Xmiles/ProTable';

import { services } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';

import { compose } from '@/decorators/utils';
import disabled from '@/decorators/ATag/Disabled';

import { STATUS } from '../models';

// unsaved test

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useModalForm();

  async function addHandler() {
    try {
      await services.check({ notify: false, throwErr: true });
      editor.setModalProps((pre) => ({
        ...pre,
        visible: true,
        title: '新增',
      }));
    } catch {
      Modal.error({
        title: '提示',
        content: '最多可展示10个热词，目前展示数量已达到10个； 无法新增',
      });
    }
  }

  function editHandler(row: Row) {
    return () => {
      editor.setModalProps((pre) => ({
        ...pre,
        visible: true,
        title: '编辑',
      }));
      editor?.form?.setFieldsValue?.(row);
    };
  }

  function removeHandler(id: Row['id']) {
    return async () => {
      await services.delete({ data: { id } });
      await onSuccess();
    };
  }

  function onSuccess() {
    tableReload();
    editor?.form?.resetFields?.();
  }

  function tableReload() {
    actionRef.current?.reload();
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '搜索热词',
      dataIndex: 'word',
      width: 100,
    },
    {
      title: '展示状态',
      dataIndex: 'showStatus',
      width: 100,
      hideInSearch: true,
      valueEnum: STATUS,
    },
    {
      title: '展示位置',
      dataIndex: 'sort',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'utime',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 150,
      hideInSearch: true,
      fixed: 'right',
      renderText: (id, row) => {
        return (
          <Space>
            {compose(disabled(false))(<a onClick={editHandler(row)}>编辑</a>)}
            <Popconfirm onConfirm={removeHandler(id)} title="确定删除吗？">
              {compose(disabled(false))(<a>删除</a>)}
            </Popconfirm>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={addHandler}>
            新增
          </Button>
        }
        options={false}
        pagination={{ pageSize: 10 }}
        request={async (params) => {
          const data = {
            ...params,
            page: {
              pageNo: params?.current,
              pageSize: params?.pageSize,
            },
          };
          const res = await services.page({ data });

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
