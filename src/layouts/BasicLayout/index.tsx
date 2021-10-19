import React, { useState } from 'react';
import styles from './index.less';
import LoginContext from '@/hooks/useLogin';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Account from './Account';

const BasicLayout: React.FC = (props) => {
  const { Header, Sider, Content } = Layout;
  // const { loginStatus } = LoginContext.useContainer()
  // console.log('loginStatus:', loginStatus)
  return (
    <Layout className={styles['basic-layout']}>
      <LoginContext.Provider>
        <Header className={styles.header}>
          <div className={styles['left-content']}>
            <div className={styles.projectName}>556 游戏管理平台系统</div>
          </div>
          <Account />
        </Header>
        <Layout className={styles['site-layout']}>
          <Sider className={styles.sider} trigger={null} collapsible>
            <div className="logo" />
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                nav 2
              </Menu.Item>
              <Menu.Item key="3" icon={<UploadOutlined />}>
                nav 3
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className="site-layout-background" style={{ padding: 16, minHeight: 280 }}>
            <div className={styles.normal}>{props.children}</div>
          </Content>
        </Layout>
      </LoginContext.Provider>
    </Layout>
  );
};

export default BasicLayout;
