// import { router } from 'umi'
import React from 'react';
import UserContext from '@/hooks/useUser';
// import { history } from 'umi'
import { Redirect } from 'umi';
import { notification } from 'antd';

const Authorized: React.FC = ({ children }) => {
  // console.log('Authorized:', children, other);
  const { checkLoginState } = UserContext.useContainer();
  if (!checkLoginState()) {
    // history.replace('/')
    notification.error({
      message: '授权失败',
      description: '登录过期，请重新登录',
      key: 'notificationKey',
    });
    return <Redirect to="/user/login" />;
  } else {
    return <>{children}</>;
  }
};

export default Authorized;
