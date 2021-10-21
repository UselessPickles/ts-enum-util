import React from 'react';
import LoginContext from '@/hooks/useLogin';

const Layout: React.FC = ({ children }) => (
  <LoginContext.Provider>{children}</LoginContext.Provider>
);

export default Layout;
