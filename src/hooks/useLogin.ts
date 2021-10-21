import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router';
import { accountLogin } from '@/services/user';

function useLogin() {
  const [loginStatus, setLoginStatus] = useState(() => Boolean(localStorage.getItem('token')));
  const history = useHistory();
  // console.log('run useLogin', loginStatus);
  const logIn = (username, password) => {
    setLoginStatus(true);
    accountLogin({ username, password })
      .then((res) => {
        const { access_token } = res.data;
        localStorage.setItem('token', access_token);
        history.push({ pathname: '/home' });
      })
      .catch((error) => {
        return error;
      });
  };
  const logOut = () => {
    setLoginStatus(false);
    localStorage.removeItem('token');
    history.push({ pathname: '/user/login' });
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
  };
}

const LoginContext = createContainer(useLogin);

export default LoginContext;
