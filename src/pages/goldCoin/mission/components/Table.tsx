import type { XmilesCol } from '@/components/Xmiles/Col';
import type Row from '../models';

import { Button, Space, Popconfirm, Switch } from 'antd';

import XmilesTable from '@/components/Xmiles/ProTable';

import { services } from '../services/task';
import useProTable from '@/components/Xmiles/ProTable/useProTable';
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
import useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';

export default function () {
  const { actionRef, formRef } = useProTable();

  const editor = useDrawerForm();

  const missions: Map<Row['code'], ReturnType<typeof useDrawerForm>> = new Map([
    ['SmallBall', useDrawerForm()],
    ['SignIn', useDrawerForm()],
    ['FirstPlayGame', useDrawerForm()],
    ['StartGame', useDrawerForm()],
    ['BrowseGameDetails', useDrawerForm()],
    ['NewPeopleRedEnvelopes', useDrawerForm()],
  ]);

  function missionEditHandler(r: Row) {
    return () => {
      const handler = missions?.get(r.code);
      handler?.setDrawerProps?.((pre) => ({
        ...pre,
        visible: true,
      }));

      handler?.setData({ taskId: r.id });
    };
  }

  function editHandler() {
    editor.setDrawerProps((pre) => ({
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

  function switchHandler(r: Row) {
    return async () => {
      try {
        await services.update({
          data: {
            id: r?.id,
            status: r?.status === STATUS_ENUM.启用 ? STATUS_ENUM.禁用 : STATUS_ENUM.启用,
          },
        });
        actionRef.current?.reload();
      } catch (e) {
        console.warn(e);
      }
    };
  }

  const columns: XmilesCol<Row>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: STATUS,
      render(_, record) {
        const validStatus = record.status === STATUS_ENUM.启用;
        return (
          <Popconfirm
            title={`确定${validStatus ? '禁用' : '启用'}吗？`}
            onConfirm={switchHandler(record)}
          >
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
      renderText: (_, record) => {
        return (
          <Space>
            {compose(disabled(false))(<a onClick={missionEditHandler(record)}>编辑</a>)}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Editor {...editor} onSuccess={onSuccess} />

      <Ball
        {...(missions?.get('SmallBall') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />
      <SignIn
        {...(missions?.get('SignIn') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />
      <Play
        {...(missions?.get('FirstPlayGame') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />
      <Boot
        {...(missions?.get('StartGame') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />
      <VisDetail
        {...(missions?.get('BrowseGameDetails') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />
      <RedPacket
        {...(missions?.get('NewPeopleRedEnvelopes') as ReturnType<typeof useDrawerForm>)}
        onSuccess={onSuccess}
      />

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
            data: res?.data?.total_datas ?? [],
            page: params.current ?? 1,
            success: true,
            total: res?.data?.total_count ?? 0,
          };
        }}
      />
    </>
  );
}
