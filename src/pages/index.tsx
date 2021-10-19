import styles from './index.less';
import { Button } from 'antd';
import LoginContext from '@/hooks/useLogin';

export default function IndexPage() {
  const { logIn, logOut, loginStatus } = LoginContext.useContainer();
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      {loginStatus ? (
        <Button onClick={logOut}>LogOut</Button>
      ) : (
        <Button onClick={logIn}>LogIn</Button>
      )}
    </div>
  );
}
