import ModalForm from '@/components/ModalForm';
import RESTful from '@/utils/RESTful';
import FileDoneOutlined from '@ant-design/icons/lib/icons/FileDoneOutlined';
import { Form, Tabs, Image, Space, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useContainer } from '../useStore';
import styles from '../index.less';

const { Item } = Form,
  { TabPane } = Tabs;

export default () => {
  const { setModalProps, editRecord, modalProps, actionRef } = useContainer();
  const [detailList, setDetailList] = useState<any>();
  const AutoTabs = styled(Tabs)`
    & > .ant-tabs-nav::before {
      border-bottom: 0px solid white !important;
    }
    .ant-tabs-tab {
      padding: 0px 0 7px !important;
    }
    .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 8px;
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #000000d8 !important;
    }
  `;

  useEffect(() => {
    RESTful.post('fxx/game/auto/test/detail/page', {
      data: {
        gameAutoTestId: editRecord?.id,
      },
    }).then((res) => {
      setDetailList(res?.data?.total_datas);
    });
  }, [modalProps]);

  function onClose() {
    setModalProps({
      visible: false,
    });
    setDetailList(undefined);
  }

  function statusSubmit(status: any) {
    Modal.confirm({
      title: '请进行二次确认',
      content: `${status == 1 ? '审核通过游戏将' : '游戏不会'}进入游戏测试库，确定吗？`,
      onOk: () => {
        RESTful.post('fxx/game/auto/test/detail/reviewStatus', {
          data: { gameAutoTestId: editRecord?.id, status },
        }).then((res) => {
          res?.result?.status == 1 && onClose() && actionRef?.current?.reload();
        });
      },
      onCancel: () => {},
    });
  }

  return (
    <Modal footer={null} width={800} onCancel={onClose} {...modalProps}>
      <div style={{ display: 'flex' }}>
        <div className={styles.titleDiv} style={{ width: detailList?.length == 0 ? '25%' : '10%' }}>
          <span style={{ marginBottom: 17 }}>机型：{detailList?.length == 0 && '未开始测试'}</span>
          <span>画面截图：{detailList?.length == 0 && '未开始测试'}</span>
        </div>
        <AutoTabs style={{ width: '90%' }}>
          {detailList?.map((item: any, index: any) => {
            return (
              <TabPane
                tab={
                  <span style={{ color: item.status == 1 ? '#000000d8' : 'red' }}>
                    {item.phoneModel}
                  </span>
                }
                key={index}
              >
                <Image.PreviewGroup>
                  {item?.gameScreenshot?.map((item: any, index: any) => {
                    return (
                      <div className={styles.ImgDiv} key={index}>
                        <FileDoneOutlined className={styles.icon} hidden={item?.status == 1} />
                        <Image
                          src={item?.url}
                          key={index}
                          width={200}
                          style={{ paddingRight: '10px' }}
                        />
                        <div className={styles.ImgName}>{item?.name || '页面'}</div>
                      </div>
                    );
                  })}
                </Image.PreviewGroup>
              </TabPane>
            );
          })}
        </AutoTabs>
      </div>
      <div className={styles.submitButton}>
        <Space>
          <Button
            onClick={() => statusSubmit(2)}
            disabled={!editRecord?.onOff ? true : !(editRecord?.reviewStatus == 1)}
          >
            审核不通过
          </Button>
          <Button
            type="primary"
            onClick={() => statusSubmit(1)}
            disabled={!editRecord?.onOff ? true : editRecord?.reviewStatus == 2}
          >
            审核通过
          </Button>
        </Space>
      </div>
    </Modal>
  );
};
