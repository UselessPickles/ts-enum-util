import type { PropsWithChildren } from 'react';
import { Form, Drawer, Space, Button } from 'antd';
import type { DrawerProps } from 'antd';
import type { InitValue } from './useDrawerForm';

export default ({ children, drawerProps, formProps }: PropsWithChildren<InitValue>) => (
  <CustomDrawer {...drawerProps}>
    <Form {...formProps}>
      {children}
      <Form.Item hidden>
        <button html-type="submit" />
      </Form.Item>
    </Form>
  </CustomDrawer>
);

export interface CustomDrawerProps extends DrawerProps {
  onOk?: (...args: any[]) => void;
  confirmLoading?: boolean;
}

export function CustomDrawer({ onOk, confirmLoading, ...props }: CustomDrawerProps) {
  return (
    <Drawer
      footer={
        <Space>
          <Button onClick={props?.onClose as any}>取消</Button>
          <Button type="primary" onClick={onOk} loading={confirmLoading}>
            确定
          </Button>
        </Space>
      }
      {...props}
    />
  );
}
