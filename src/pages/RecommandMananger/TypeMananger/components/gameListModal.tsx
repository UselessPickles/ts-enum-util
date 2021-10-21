import ModalForm from '@/components/ModalForm';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { Button, Modal, Table, Transfer } from 'antd';
import React, { useState, useEffect } from 'react';
import { gameList } from '../services';
import { useContainer } from '../useStore';
import styled from 'styled-components';
import styles from '../index.less';
import { dragComponents } from './dragComponents';
// import { difference } from 'react-query/types/core/utils';

export default () => {
  const [dataSource, setDataSource] = useState<any>(),
    [targetKeys, setTargetKeys] = useState<any>(),
    { gameModalProps, setGameModalProps } = useContainer(),
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
    `,
    GameTransfer = styled(Transfer)`
      .ant-transfer-list {
        border-radius: 4px !important;
      }
      .ant-transfer-list-header {
        background: #f1f4f9;
      }
      .ant-transfer-operation > Button {
        display: none;
      }
    `;
  function onRow(record: any, index: number) {
    return {
      index,
      moveRow: moveRow,
    };
  }
  function moveRow(dragIndex: number, hoverIndex: number) {
    const data = [...dataSource];
    data.splice(dragIndex, 1);
    data.splice(hoverIndex, 0, dataSource[dragIndex]);
    data.forEach((item, index) => {
      item.sort = index + 1 + '';
    });
    setDataSource(data);
  }

  const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <GameTransfer {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
      }) => {
        console.log(`${direction}'filteredItems'`, filteredItems);
        // console.log('filteredItems',filteredItems,'onItemSelect',onItemSelect)
        const rowSelection = {
          type: 'checkbox',
          onSelect({ key }: any, selected: boolean) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        return direction === 'left' ? (
          <GameTable
            rowSelection={rowSelection}
            columns={leftColumns}
            rowKey="key"
            pagination={false}
            dataSource={filteredItems}
            size="small"
            //style={{ pointerEvents: listDisabled ? "none" : null }}
            onRow={({ key }) => ({
              onClick: () => {
                onItemSelect(key, true);
              },
            })}
          />
        ) : (
          <GameTable
            columns={rightColumns}
            dataSource={filteredItems}
            pagination={false}
            size="small"
          />
        );
      }}
    </GameTransfer>
  );

  useEffect(() => {
    //gameList({data: {cagetory: ''}})
    setDataSource([
      { key: 1, icon: '123', gameName: '123', packageName: '123' },
      { key: 2, icon: '234', gameName: '567', packageName: '789' },
    ]); //模拟数据
  }, []);
  const selectedColumns = [];
  const columns = [
    {
      dataIndex: 'icon',
    },
    {
      dataIndex: 'gameName',
      render: (text, record, index) => {
        return (
          <div className={styles.gameClass}>
            <h5>{record?.gameName}</h5>
            <p>{record?.packageName}</p>
          </div>
        );
      },
    },
    {
      render: () => {
        return <Button type="link" icon={<DeleteOutlined />}></Button>;
      },
    },
  ];
  return (
    <Modal
      // formProps={{ labelCol: { span: 7 }, wrapperCol: { span: 14 } }}
      // modalProps={{ ...gameModalProps, onCancel }}
      {...gameModalProps}
      onCancel={onCancel}
      onOk={onCancel}
    >
      <TableTransfer
        dataSource={dataSource}
        targetKeys={targetKeys}
        selectedKeys={targetKeys}
        showSearch
        showSelectAll={false}
        titles={['可选游戏', '已选游戏']}
        // oneWay
        onSelectChange={(selected: any, target: any) => {
          console.log('select', selected, 'target', target);
          setTargetKeys([...selected, ...target]);
        }}
        filterOption={(inputValue: any, item: { gameName: any; packegeName: any }) =>
          item.gameName.indexOf(inputValue) !== -1 || item.packageName.indexOf(inputValue) !== -1
        }
        leftColumns={columns}
        rightColumns={columns}
      />
    </Modal>
  );
};
