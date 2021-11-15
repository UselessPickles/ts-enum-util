import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Button, Space, Popconfirm, Switch } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';

import { services } from '../services';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
import useModalForm from '@/hooks/useModalForm';
import Editor from './Editor';
import Ball from './Ball';
import SignIn from './SignIn';
import { compose } from '@/decorators/utils';
import disabled from '@/decorators/ATag/Disabled';
import { STATUS, STATUS_ENUM } from '../models';

const fakeDataSource = Array(6)
  ?.fill(undefined)
  ?.map((_, idx) => ({
    missionName: idx,
    status: idx,
    id: idx,
  }));

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useModalForm({
    modalProps: { title: '金币规则配置', width: 760 },
    formProps: {
      layout: 'horizontal',
      labelCol: {
        span: 6,
        style: {
          whiteSpace: 'normal',
        },
      },
      wrapperCol: { span: 18 },
    },
  });

  const ball = useModalForm({
    modalProps: { title: '小圆球任务', width: 900 },
  });

  const signIn = useModalForm({
    modalProps: { title: '签到任务' },
  });

  function editHandler() {
    editor.setModalProps((pre) => ({
      ...pre,
      visible: true,
    }));
  }

  function onSuccess() {
    tableReload();
  }

  function tableReload() {
    actionRef.current?.reload();
  }

  function switchHandler() {}

  const columns: XmilesCol<Row>[] = [
    {
      title: '任务名称',
      dataIndex: 'missionName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: STATUS,
      render(_, record) {
        const validStatus = record.status === STATUS_ENUM.启用;
        return (
          <Popconfirm title={`确定${validStatus ? '禁用' : '启用'}吗？`} onConfirm={switchHandler}>
            <Switch checked={validStatus} />
          </Popconfirm>
        );
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
      dataIndex: 'id',
      hideInSearch: true,
      width: 150,
      fixed: 'right',
      renderText: (id) => {
        return <Space>{compose(disabled(false))(<a>编辑</a>)}</Space>;
      },
    },
  ];

  return (
    <>
      <Editor {...editor} onSuccess={onSuccess} />
      <Ball {...ball} onSuccess={onSuccess} />
      <SignIn {...signIn} onSuccess={onSuccess} />

      <XmilesTable
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        headerTitle={
          <Button onClick={editHandler} type="primary">
            金币规则限制
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
          const res = await services.page({ data });

          return {
            // undo
            // data: res?.data?.total_datas ?? [],
            data: fakeDataSource,
            page: params.current ?? 1,
            success: true,
            //undo
            // total: res?.data?.total_count ?? 0,
            total: fakeDataSource?.length,
          };
        }}
      />
    </>
  );
}
