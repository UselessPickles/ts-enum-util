import React from 'react';
import UserContext from '@/hooks/useUser';

const Layout: React.FC = ({ children }) => <UserContext.Provider>{children}</UserContext.Provider>;

export default Layout;
