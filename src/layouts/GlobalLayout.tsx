import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import UserContext from '@/hooks/useUser';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

const queryClient = new QueryClient();

const Layout: React.FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider>
        <ConfigProvider
          locale={zhCN}
          form={{ validateMessages: { required: '${label} 是必选字段' } }}
        >
          {children}
        </ConfigProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default Layout;
