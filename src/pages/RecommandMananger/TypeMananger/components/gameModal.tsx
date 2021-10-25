import { Form, Input, Modal } from 'antd';
import styles from '../index.less';
import { useContainer, gameTable } from '../useStore';
import React, { useState, useEffect } from 'react';
import gameImg from '@/assets/img/icon-566game.png';
import sortIcon from '@/assets/img/icon-sort.png';
import { SortableHandle } from 'react-sortable-hoc';
import isValidValue from '@/utils/isValidValue';
import { MenuOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { dragComponents } from './dragComponents';
import GameList from '@/querys/GameList';

export default () => {
  const {
      gameModalProps,
      setGameModalProps,
      checkedGames,
      setCheckedGames,
      selectedRowKeys,
      setSelectRowKeys,
    } = useContainer(),
    [dataSource, setDataSource] = useState<any>(),
    { GameTable } = gameTable(),
    onCancel = () => {
      setGameModalProps({
        visible: false,
      });
      setCheckedGames([]);
      setSelectRowKeys([]);
    },
    onSubmit = () => {
      setGameModalProps({
        visible: false,
      });
      setSelectRowKeys([]);
    };
  // const gameListSource = GameList({ format: (res) => res?.data })?.data ?? [];
  // console.log('gameListSource',gameListSource)

  const gameData = [
    { key: 5, icon: '123', gameName: '123', packageName: '123' },
    { key: 7, icon: '234', gameName: '567', packageName: '789' },
    { key: 10, icon: '1011', gameName: '5874', packageName: '789' },
  ]; //模拟数据

  const DragHandle = SortableHandle(() => (
    <div>
      <img src={sortIcon} style={{ cursor: 'move', width: 24 }} />
    </div>
  ));

  useEffect(() => {
    setDataSource(gameData);
  }, []);

  function onTableSelectChange(rowKeys: any[], rowData: any[]) {
    setSelectRowKeys(rowKeys);
    setCheckedGames(rowData);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange,
    type: 'checkbox',
  };

  function onRow(record: any, index: number) {
    return {
      index,
      moveRow: moveRow,
    };
  }
  function moveRow(dragIndex: number, hoverIndex: number) {
    const data = [...checkedGames];
    data.splice(dragIndex, 1);
    data.splice(hoverIndex, 0, checkedGames[dragIndex]);
    data.forEach((item, index) => {
      item.sort = index + 1 + '';
    });
    setCheckedGames(data);
  }

  function delectChecked(record: any) {
    const { key } = record;
    selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
    const rowData = checkedGames.filter((item: any) => {
      return item !== record;
    });
    onTableSelectChange(selectedRowKeys, rowData);
  }

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
  const selectColumns = [
    {
      dataIndex: 'sort',
      with: 30,
      className: styles.drag,
      render: () => <DragHandle />,
    },
    {
      dataIndex: 'icon',
      render: () => {
        return <img src={gameImg} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 550,
      render: (text: any, record: any, index: any) => {
        return (
          <div className={styles.gameClass}>
            <h5>{record?.gameName}</h5>
            <p>{record?.packageName}</p>
          </div>
        );
      },
    },
    {
      with: 30,
      render: (text: any, record: any, index: any) => {
        return <CloseOutlined onClick={() => delectChecked(record)} style={{ color: '#ADADAE' }} />;
      },
    },
  ];

  return (
    <Modal {...gameModalProps} onCancel={onCancel} onOk={onSubmit} width={800}>
      <div className={styles.gameEdit}>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle}>可选游戏</div>
            <Input
              style={{ width: '70%', border: '1px solid #E0E0E0' }}
              placeholder={`游戏名/包名关键词搜索`}
              prefix={<SearchOutlined />}
              onChange={(e) => {
                const inputGame = e.target.value;
                setDataSource(
                  isValidValue(inputGame)
                    ? gameData?.filter((item) => {
                        return (
                          item.gameName?.indexOf(inputGame ?? '') !== -1 ||
                          item.packageName?.indexOf(inputGame ?? '') !== -1
                        );
                      })
                    : gameData,
                );
              }}
            />
          </div>
          <div className={styles.gameBody}>
            <GameTable
              rowSelection={rowSelection}
              dataSource={dataSource}
              columns={columns}
              size="small"
              pagination={false}
            />
          </div>
        </div>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle}>
              已选游戏{selectedRowKeys?.length > 0 ? `(${selectedRowKeys?.length})` : ``}
            </div>
          </div>
          <div
            className={styles.gameBody}
            style={{ padding: 12 }}
            hidden={!(selectedRowKeys?.length > 0)}
          >
            <GameTable
              rowKey="key"
              pagination={false}
              className={styles.checkedGameTable}
              columns={selectColumns}
              dataSource={checkedGames}
              components={dragComponents}
              onRow={onRow}
              size="small"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
