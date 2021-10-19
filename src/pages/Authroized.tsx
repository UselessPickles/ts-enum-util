// import { router } from 'umi'
import React from 'react';
import LoginContext from '@/hooks/useLogin';
// import { history } from 'umi'
import { Redirect } from 'umi';

const Authroized: React.FC = ({ children, ...other }) => {
  console.log('Authroized:', children, other);
  const { loginStatus } = LoginContext.useContainer();
  // checkLogStatus()
  // console.log('loginStatus:', loginStatus)

  if (!loginStatus) {
    // history.replace('/')
    return <Redirect to="/" />;
  } else {
    return <>{children}</>;
  }
};

export default Authroized;
