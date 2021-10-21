import React, { useState } from 'react';
import styles from './index.less';
import LoginContext from '@/hooks/useLogin';
import { Layout, Menu, ConfigProvider } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Account from './Account';
import zhCN from 'antd/es/locale/zh_CN';
import { QueryClient, QueryClientProvider } from 'react-query';
import SliderMenu from './SiderMenu';
import SiderMenuContext from '@/hooks/useSiderMenu';

const queryClient = new QueryClient();

const BasicLayout: React.FC = (props) => {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout className={styles['basic-layout']}>
      <QueryClientProvider client={queryClient}>
        <LoginContext.Provider>
          <SiderMenuContext.Provider>
            <Header className={styles.header}>
              <div className={styles['left-content']}>
                <div className={styles.projectName}>566 游戏管理平台</div>
              </div>
              <Account />
            </Header>
            <Layout className={styles['site-layout']}>
              <Sider className={styles.sider} trigger={null} collapsible>
                <div className="logo" />
                <SliderMenu />
              </Sider>
              <Content className="site-layout-background" style={{ padding: 16, minHeight: 280 }}>
                <ConfigProvider
                  locale={zhCN}
                  form={{ validateMessages: { required: '${label} 是必选字段' } }}
                >
                  {props.children}
                </ConfigProvider>
              </Content>
            </Layout>
          </SiderMenuContext.Provider>
        </LoginContext.Provider>
      </QueryClientProvider>
    </Layout>
  );
};

export default BasicLayout;
