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
import Play from './Play';
import Boot from './Boot';
import RedPacket from './RedPacket';
import VisDetail from './VisDetail';

const fakeDataSource = Array(6)
  ?.fill(undefined)
  ?.map((_, idx) => ({
    missionName: idx,
    status: idx,
    id: idx,
  }));

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useModalForm();

  const missions = {
    ball: useModalForm(),
    signIn: useModalForm(),
    play: useModalForm(),
    boot: useModalForm(),
    visDetail: useModalForm(),
    redPacket: useModalForm(),
  };

  function missionEditHandler(id: Row['id']) {
    return () => {
      const handle: keyof typeof missions = [
        'ball',
        'signIn',
        'play',
        'boot',
        'visDetail',
        'redPacket',
      ]?.[+id];

      missions?.[handle]?.setModalProps?.((pre) => ({
        ...pre,
        visible: true,
      }));
    };
  }

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
        return (
          <Space>{compose(disabled(false))(<a onClick={missionEditHandler(id)}>编辑</a>)}</Space>
        );
      },
    },
  ];

  return (
    <>
      <Editor {...editor} onSuccess={onSuccess} />

      <Ball {...missions?.ball} onSuccess={onSuccess} />
      <SignIn {...missions?.signIn} onSuccess={onSuccess} />
      <Play {...missions?.play} onSuccess={onSuccess} />
      <Boot {...missions?.boot} onSuccess={onSuccess} />
      <VisDetail {...missions?.visDetail} onSuccess={onSuccess} />
      <RedPacket {...missions?.redPacket} onSuccess={onSuccess} />

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
