// import { router } from 'umi'
import React from 'react';
import UserContext from '@/hooks/useUser';
// import { history } from 'umi'
import { Redirect } from 'umi';

const Authorized: React.FC = ({ children, ...other }) => {
  // console.log('Authorized:', children, other);
  const { checkLoginState } = UserContext.useContainer();
  if (!checkLoginState()) {
    // history.replace('/')
    return <Redirect to="/user/login" />;
  } else {
    return <>{children}</>;
  }
};

export default Authorized;
