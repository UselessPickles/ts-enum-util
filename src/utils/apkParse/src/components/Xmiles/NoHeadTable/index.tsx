import { Table } from 'antd';
import styled from 'styled-components';

/**
 * 重载Table样式
 */
const GameTable = styled(Table)`
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

export default GameTable;
