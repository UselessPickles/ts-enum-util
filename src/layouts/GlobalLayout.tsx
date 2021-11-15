import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import UserContext from '@/hooks/useUser';
import SiderMenuContext from '@/hooks/useSiderMenu';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient();

const Layout: React.FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <SiderMenuContext.Provider>
          <UserContext.Provider>
            <ConfigProvider
              locale={zhCN}
              form={{ validateMessages: { required: '${label} 是必选字段' } }}
            >
              {children}
            </ConfigProvider>
          </UserContext.Provider>
        </SiderMenuContext.Provider>
      </DndProvider>
    </QueryClientProvider>
  );
};

export default Layout;
