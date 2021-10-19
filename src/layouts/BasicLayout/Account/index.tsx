import React from 'react';
import { Avatar, Menu, Spin } from 'antd';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';

const Account: React.FC = () => {
  return (
    <div className={styles.account}>
      <div></div>
      <Avatar className={styles.avatar}>{'TT'}</Avatar>
      <span className={styles.name}>{'BB'}</span>
      <DownOutlined />
    </div>
  );
};

export default Account;
