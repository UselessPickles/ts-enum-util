import styles from './index.less';
import { Button } from 'antd';
import UserContext from '@/hooks/useUser';
import { Form, Input, notification } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { getmd5 } from '@/utils/utils';

export default function Login() {
  const { logIn } = UserContext.useContainer();
  const onFinish = ({ username, password }) => {
    logIn(username, getmd5(password));
  };
  return (
    <div className={styles.content}>
      <div style={{ width: '1152px', margin: '0 auto' }}>
        <div className={styles.main}>
          <div className={styles.loginTitle}>账户登录</div>
          <Form onFinish={onFinish}>
            <Form.Item
              style={{ marginBottom: '16px' }}
              label="username"
              name="username"
              rules={[{ required: true, message: '请输入手机号或账户名' }]}
            >
              <Input prefix={<UserOutlined />} size="large" placeholder="请输入手机号/账号" />
            </Form.Item>
            <Form.Item
              label="password"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input
                type="password"
                prefix={<LockOutlined />}
                size="large"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Button className={styles.loginSubmit} htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.loginFooter}>
            <a
              className={styles.forgetPassword}
              onClick={() =>
                notification.info({ message: '请联系与您有业务对接的市场人员，让其配合重置密码' })
              }
            >
              忘记密码
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
