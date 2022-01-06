import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

/**
 * 重载ProTable样式
 */
const XmilesTable = styled(ProTable)`
  .ant-table-thead > tr > th {
    color: #333333;
    background: #f1f4f9;
  }
  .ant-pro-table-toolbar {
    padding: 0 16px;
  }

  .ant-card,
  .ant-pro-table-search {
    border-radius: 4px;
  }

  .ant-table-pagination.ant-pagination {
    position: relative;
    padding: 0;
  }

  .ant-pagination-total-text,
  .ant-pagination-simple-pager {
    position: absolute;
    left: 0;
    color: #666666;
  }

  .anticon-setting::after {
    content: '自定义列';
  }

  .anticon-fullscreen::after {
    content: '全屏';
  }

  .ant-pro-table-toolbar-item-icon:first-child {
    margin-left: 0;
  }

  .anticon-setting,
  .anticon-fullscreen,
  .anticon-reload,
  .anticon-column-height {
    padding: 9px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    :after {
      margin-left: 4px;
    }
  }

  .ant-pro-table-toolbar-item-icon,
  .anticon-setting,
  .anticon-fullscreen,
  .anticon-reload,
  .anticon-column-height {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333333;
    font-weight: 400;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
`;

export default XmilesTable;
