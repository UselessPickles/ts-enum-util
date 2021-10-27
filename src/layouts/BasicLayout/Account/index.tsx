import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import UserContext from '@/hooks/useUser';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

function changePwd() {
  console.log('changePwd');
}

const Account: React.FC = () => {
  const { userInfo, logOut } = UserContext.useContainer();
  const { name } = userInfo;
  const downMenu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />} onClick={changePwd}>
        修改密码
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={logOut}>
        退出登陆
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.account}>
      <div />
      <Avatar className={styles.avatar}>{name ? name[0] : ''}</Avatar>
      <Dropdown overlay={downMenu}>
        <span className={styles.name}>{name}</span>
      </Dropdown>
      <DownOutlined />
    </div>
  );
};

export default Account;
