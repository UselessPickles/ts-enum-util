import React from 'react';
import styles from './index.less';
import { Layout } from 'antd';
import Account from './Account';
import SliderMenu from './SiderMenu';
import SiderMenuContext from '@/hooks/useSiderMenu';

const BasicLayout: React.FC = (props) => {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout className={styles['basic-layout']}>
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
            <div style={{ padding: 16, position: 'relative' }}>{props.children}</div>
          </Content>
        </Layout>
      </SiderMenuContext.Provider>
    </Layout>
  );
};

export default BasicLayout;
