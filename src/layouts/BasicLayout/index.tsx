import React from 'react';
import styles from './index.less';
import UserContext from '@/hooks/useUser';
import { Layout, ConfigProvider } from 'antd';
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
        <UserContext.Provider>
          <SiderMenuContext.Provider>
            <Header className={styles.header}>
              <div className={styles['left-content']}>
                <div className={styles.projectName}>{PROCESS_ENV.APP_CN_NAME}</div>
              </div>
              <Account />
            </Header>
            <Layout className={styles['site-layout']}>
              <Sider className={styles.sider} trigger={null} collapsible>
                <div className="logo" />
                <SliderMenu />
              </Sider>
              <Content className="site-layout-background" style={{ minHeight: 280 }}>
                <div style={{ padding: 16 }}>
                  <ConfigProvider
                    locale={zhCN}
                    form={{ validateMessages: { required: '${label} 是必选字段' } }}
                  >
                    {props.children}
                  </ConfigProvider>
                </div>
              </Content>
            </Layout>
          </SiderMenuContext.Provider>
        </UserContext.Provider>
      </QueryClientProvider>
    </Layout>
  );
};

export default BasicLayout;
