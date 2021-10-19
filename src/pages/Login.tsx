import styles from './index.less';
import { Button } from 'antd';
import LoginContext from '@/hooks/useLogin';

const LoginWrapper = () => {
  const { logIn, logOut, loginStatus } = LoginContext.useContainer();
  return (
    <>
      {loginStatus ? (
        <Button onClick={logOut}>LogOut</Button>
      ) : (
        <Button onClick={logIn}>LogIn</Button>
      )}
    </>
  );
};

export default function IndexPage() {
  return (
    <LoginContext.Provider>
      <h1 className={styles.title}>Page index</h1>
      <LoginWrapper />
    </LoginContext.Provider>
  );
}
