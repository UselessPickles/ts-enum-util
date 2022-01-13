import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router';
import { accountLogin, queryMenu } from '@/services/user';
import SiderMenuContext from '@/hooks/useSiderMenu';

function checkLoginState() {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return Boolean(token) && Boolean(Object.keys(userInfo).length);
}

function useUser() {
  const [loginStatus, setLoginStatus] = useState(() => checkLoginState());
  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem('userInfo') || '{}'),
  );
  const { setMenu } = SiderMenuContext.useContainer();
  const history = useHistory();
  const logIn = async (username, password) => {
    setLoginStatus(true);
    try {
      const accountInfo = await accountLogin({ username, password });
      const { access_token, name, id } = accountInfo;
      const uname = accountInfo.username;
      const user = { id, name, username: uname };
      localStorage.setItem('token', access_token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      history.push({ pathname: '/gameStore/mgt' });
      setUserInfo(user);
      const menu = await queryMenu();
      setMenu(menu);
    } catch (error) {
      return error;
    }
    // accountLogin({ username, password })
    //   .then((res) => {
    //     const { access_token, name, id, username } = res;
    //     const user = { id, name, username };
    //     localStorage.setItem('token', access_token);
    //     localStorage.setItem('userInfo', JSON.stringify(user));
    //     history.push({ pathname: '/home' });
    //     setUserInfo(user);
    //   })
    //   .catch((error) => {
    //     return error;
    //   });
  };
  const logOut = () => {
    setLoginStatus(false);
    setUserInfo({});
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    try {
      if (window.parent && window !== window.top) {
        window.parent.location.reload();
      }
    } catch (error) {
      history.push({ pathname: '/user/login' });
    }
  };
  const checkLogStatus = () => {
    const token = localStorage.getItem('token');
    setLoginStatus(Boolean(token));
    return Boolean(token);
  };

  return {
    loginStatus,
    setLoginStatus,
    logIn,
    logOut,
    checkLogStatus,
    checkLoginState,
    userInfo,
  };
}

const UserContext = createContainer(useUser);

export default UserContext;
