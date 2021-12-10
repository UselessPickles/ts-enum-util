import { Input, Modal, Spin, message, Tag, Typography } from 'antd';
import styles from '../index.less';
import { useContainer } from '../useStore';
import React, { useState, useEffect } from 'react';
import sortIcon from '@/assets/img/icon-sort.png';
import { SortableHandle } from 'react-sortable-hoc';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { dragComponents } from './dragComponents';
import { gameList } from '@/services/gameQuery';
import GameTable from '@/components/Xmiles/NoHeadTable';

const { Text } = Typography;

export default () => {
  const {
      gameModalProps,
      setGameModalProps,
      checkedGames,
      setCheckedGames,
      selectedRowKeys,
      setSelectRowKeys,
      page,
      setPage,
      loading,
      setLoading,
    } = useContainer(),
    [dataSource, setDataSource] = useState<any>([]),
    [inputSelect, setInputSelect] = useState<string>(), //查询
    [editGameList, setEditGameList] = useState<any>([]), //编辑选择的游戏列表
    [editRowKeys, setEditRowKeys] = useState<any>([]), //编辑时 rowKeys
    onSubmit = () => {
      if (editGameList?.length < 4) {
        message.error('游戏最少配置4个');
      } else {
        let changeSort = [...editGameList];
        changeSort = changeSort?.map((item, index) => {
          item.sort = index + 1;
          return item;
        });
        setCheckedGames(changeSort);
        setSelectRowKeys(editRowKeys);
        resetState();
      }
    };

  const onscroll = (e) => {
    if (
      dataSource?.length > 0 &&
      !inputSelect &&
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1
    ) {
      setPage(page + 1);
    }
  };

  function resetState() {
    setGameModalProps({
      visible: false,
    });
    setEditRowKeys([]);
    setDataSource([]);
    setEditGameList([]);
    setPage(0);
    setInputSelect(undefined);
  }

  async function queryGameList() {
    setLoading(true);
    page == 1 && setDataSource([]);
    inputSelect && setPage(1);
    try {
      const res = await gameList({
        data: {
          packageOrGameName: inputSelect,
          page: {
            pageNo: inputSelect ? 1 : page,
            pageSize: inputSelect ? 1000 : 20,
          },
        },
      });
      if (res) {
        const data = res?.data?.total_datas?.filter((item: { status: number }) => {
          return item.status == 1;
        });
        setDataSource(inputSelect || page == 1 ? data : dataSource?.concat(data));
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    queryGameList();
  }, [page, inputSelect]);

  useEffect(() => {
    setEditGameList(checkedGames);
    setEditRowKeys(selectedRowKeys);
  }, [gameModalProps]);

  const DragHandle = SortableHandle(() => (
    <div>
      <img src={sortIcon} style={{ cursor: 'move', width: 24 }} />
    </div>
  ));

  function gameMessage(gameName: string, packageName: string) {
    return (
      <div className={styles.gameClass}>
        <Text className={styles.gameName} ellipsis={{ tooltip: gameName }}>
          {gameName}
        </Text>
        <Text className={styles.packageName} ellipsis={{ tooltip: packageName }}>
          {packageName}
        </Text>
      </div>
    );
  }

  function onTableSelectChange(record: any, selected: any) {
    const gameNum = record?.gameNum;
    if (selected) {
      setEditGameList([...editGameList, record]);
      setEditRowKeys([...editRowKeys, gameNum]);
    } else {
      let selectKey = [...editRowKeys];
      selectKey.splice(selectKey.indexOf(gameNum), 1);
      setEditRowKeys(selectKey);
      let editList = [...editGameList];
      const rowData = editList?.filter((item: any) => {
        return item?.gameNum !== record?.gameNum;
      });
      setEditGameList([...rowData]);
    }
  }

  function moveRow(dragIndex: number, hoverIndex: number) {
    const data = [...editGameList];
    data.splice(dragIndex, 1);
    data.splice(hoverIndex, 0, editGameList[dragIndex]);
    data.forEach((item, index) => {
      item.sort = index + 1 + '';
    });
    setEditGameList(data);
  }

  const columns = [
    {
      dataIndex: 'gameIcon',
      with: 50,
      render: (_: any, record: any) => {
        return <img src={record?.gameIcon} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 280,
      render: (_: any, record: any) => {
        return gameMessage(record?.gameName, record?.packageName);
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
      dataIndex: 'gameIcon',
      render: (_: any, record: any) => {
        return <img src={record.gameIcon} style={{ width: '42px' }} />;
      },
    },
    {
      dataIndex: 'gameName',
      width: 400,
      textWrap: 'word-break',
      render: (_: any, record: any) => {
        return gameMessage(record?.gameName, record?.packageName);
      },
    },
    {
      with: 30,
      render: (_: any, record: any) => {
        return (
          <div style={{ width: 20, textAlign: 'center' }}>
            <CloseOutlined
              onClick={() => onTableSelectChange(record, false)}
              style={{ color: '#ADADAE' }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      {...gameModalProps}
      onCancel={resetState}
      onOk={onSubmit}
      width={800}
      zIndex={100}
      style={{ minWidth: '700px' }}
    >
      <div className={styles.gameEdit}>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle}>可选游戏</div>
            <Input
              style={{ width: '70%', border: '1px solid #E0E0E0' }}
              placeholder={`游戏名/包名关键词搜索`}
              prefix={<SearchOutlined />}
              onChange={(e) => {
                setInputSelect(e.target.value);
              }}
              allowClear
            />
          </div>
          <Spin spinning={loading} tip="Loading..." style={{ height: 400 }}>
            <div className={styles.gameBody} onScroll={onscroll}>
              <GameTable
                rowKey="gameNum"
                rowSelection={{
                  selectedRowKeys: editRowKeys,
                  onSelect: onTableSelectChange,
                  type: 'checkbox',
                }}
                dataSource={dataSource}
                columns={columns}
                size="small"
                pagination={false}
              />
            </div>
          </Spin>
        </div>
        <div>
          <div className={styles.gameHeader}>
            <div className={styles.headerTitle} style={{ marginRight: 0, width: '100%' }}>
              已选游戏{editRowKeys?.length > 0 ? `(${editRowKeys?.length})` : ``}
              <span className={styles.scrollTip}>可拖动排序</span>
              <Tag className={styles.tag}>至少选4个</Tag>
            </div>
          </div>
          <div
            className={styles.gameBody}
            style={{ padding: 12 }}
            hidden={!(editGameList?.length > 0)}
          >
            <GameTable
              rowKey="gameNum"
              pagination={false}
              className={styles.checkedGameTable}
              columns={selectColumns}
              dataSource={editGameList}
              components={dragComponents}
              onRow={(record: any, index: number) => {
                return {
                  index,
                  moveRow: moveRow,
                };
              }}
              size="small"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};