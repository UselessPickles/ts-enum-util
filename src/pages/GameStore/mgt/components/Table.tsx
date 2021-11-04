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
import disabled from '@/decorators/ATag/Disabled';
import { INSTALL_TYPE_ENUM, STATUS, TEST_STATUS, TEST_STATUS_ENUM } from '../models';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import tooltip from '@/decorators/Tooltip';
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

  const { env } = useParams<{ env: 'test' | 'prod' }>();
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

  function sync2line(gameNum: string) {
    return syncServices.save({ data: { gameNum }, throwErr: true, notify: true });
  }

  function syncConfirm(gameNum: string, first = true) {
    return Modal.confirm({
      title: '确认同步游戏一线上吗？',
      content: `${first ? '该游戏为新游戏，线上无旧版本' : '请核实无误'}，确定同步后将上线`,
      onOk: () =>
        sync2line(gameNum).then(() => {
          synchronizer.setModalProps((pre) => ({ ...pre, visible: false }));
          actionRef.current?.reload();
        }),
    });
  }

  function syncHandler(offline: Row) {
    return async () => {
      const gameNum = offline?.gameNum;
      const { prod, test } =
        (await syncServices.get({ data: { gameNum } }).then((res: any) => res?.data)) ?? {};
      if (prod) {
        const diffProd: Record<string, any> = { _status: 'prod' },
          diffTest: Record<string, any> = { _status: 'test' };

        Object.keys({ ...prod, ...test }).forEach((key) => {
          if (`${prod?.[key]}` !== `${test?.[key]}`) {
            diffProd[key] = prod?.[key];
            diffTest[key] = test?.[key];
          }
        });
        const dataSource = [diffProd, diffTest];
        synchronizer.setData({ dataSource });

        synchronizer.setFormProps((pre) => ({
          ...pre,
          onFinish: () => syncConfirm(gameNum, false),
        }));

        synchronizer.setModalProps((pre) => ({
          ...pre,
          visible: true,
          onOk: () => syncConfirm(gameNum, false),
        }));
      } else {
        syncConfirm(gameNum);
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
      title: '游戏名',
      dataIndex: 'gameName',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: STATUS,
      hideInSearch: true,
    },
    {
      title: '自动化测试状态',
      dataIndex: 'testStatus',
      width: 100,
      valueEnum: TEST_STATUS,
    },
    {
      title: '版本号',
      dataIndex: 'insideVersion',
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
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'ctime',
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
      renderText: (id, record, idx) => {
        const canSync =
          record.testStatus === TEST_STATUS_ENUM.测试成功 ||
          (record.gameSource === 'artificial' && record.installType === INSTALL_TYPE_ENUM.内部安装);

        return (
          <Space>
            {compose(disabled(false))(<a onClick={editHandler(id)}>编辑</a>)}
            {env === 'test' && (
              <>
                {compose(
                  tooltip({
                    visible: !canSync,
                    title: '此游戏未通过自动化测试，请修改安装方式为“应用外安装”后可上线',
                  }),
                  disabled(!canSync),
                )(<a onClick={syncHandler(record)}>同步到线上</a>)}
              </>
            )}
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
            const res = await services.page({ data }, env);

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
