import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

/**
 * 重载ProTable样式
 */
const XmilesTable = styled(ProTable)`
  .ant-table-thead > tr > th {
    background: #f1f4f9;
    color: #333333;
  }
  .ant-pro-table-toolbar,
  .ant-table-wrapper {
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
    left: 0;
    position: absolute;
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
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    justify-content: center;
    align-items: center;
  }
`;

export default XmilesTable;
