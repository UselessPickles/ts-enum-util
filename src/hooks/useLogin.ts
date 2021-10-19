import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router';

function useLogin() {
  const [loginStatus, setLoginStatus] = useState(() => localStorage.getItem('token') == 'true');
  const history = useHistory();
  console.log('run useLogin', loginStatus);
  const logIn = () => {
    setLoginStatus(true);
    localStorage.setItem('token', 'true');
    // history.push({ pathname: '/home' })
  };
  const logOut = () => {
    setLoginStatus(false);
    localStorage.setItem('token', 'false');
  };
  const checkLogStatus = () => {
    const token = localStorage.getItem('token');
    console.log('token Value:', token);
    console.log('checkLogStatus', loginStatus);
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
