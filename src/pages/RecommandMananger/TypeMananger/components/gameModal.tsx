import { Input, Modal, Select, Table } from 'antd';
import styled from 'styled-components';
import styles from '../index.less';
import { useContainer } from '../useStore';
import React, { useState, useEffect } from 'react';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import gameImg from '@/assets/img/icon-566game.png';

export default () => {
  const { gameModalProps, setGameModalProps } = useContainer(),
    [dataSource, setDataSource] = useState<any>(),
    [gameSelect, setGameSelect] = useState<any>(),
    onCancel = () => {
      setGameModalProps({
        visible: false,
      });
    },
    GameTable = styled(Table)`
      thead {
        display: none;
      }
      .ant-table-tbody > tr > td {
        border-bottom: 0 !important;
      }
      .ant-table-tbody > tr.ant-table-row-selected > td {
        background-color: #ffffff !important;
      }
    `;

  useEffect(() => {
    console.log('执行一次');
    setDataSource([
      { key: 1, icon: '123', gameName: '123', packageName: '123' },
      { key: 2, icon: '234', gameName: '567', packageName: '789' },
    ]); //模拟数据
  }, [gameSelect]);

  const rowSelection = {
    onchange: (selectedRowKeys: any[], selectedRows: any[]) => {},
  };

  const columns = [
    {
      dataIndex: 'icon',
      with: 50,
      render: () => {
        return <img src={gameImg} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 250,
      render: (text: any, record: any, index: any) => {
        return (
          <div className={styles.gameClass}>
            <h5>{record?.gameName}</h5>
            <p>{record?.packageName}</p>
          </div>
        );
      },
    },
  ];

  return (
    <Modal {...gameModalProps} onCancel={onCancel} onOk={onCancel} width={800}>
      <div className={styles.gameEdit}>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle}>可选游戏</div>
            <Input
              style={{ width: '70%', border: '1px solid #E0E0E0' }}
              placeholder={`游戏名/包名关键词搜索`}
              prefix={<SearchOutlined />}
              onChange={(value) => {
                setGameSelect(value);
              }}
            />
          </div>
          <div className={styles.gameBody}>
            <GameTable
              rowSelection={{ ...rowSelection }}
              dataSource={dataSource}
              columns={columns}
              size="small"
              pagination={false}
            />
          </div>
        </div>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle}>已选游戏</div>
          </div>
          <div className={styles.gameBody}></div>
        </div>
      </div>
    </Modal>
  );
};
