import React, { PropsWithChildren } from 'react';
import { Form, Drawer, Button } from 'antd';

export default ({
  children,
  modalProps,
  formProps,
  onCancel,
  onSubmit,
}: PropsWithChildren<any>) => (
  <Drawer
    placement="right"
    width={600}
    footer={[
      <div key="DrawerFooter">
        <Button onClick={onCancel} style={{ marginRight: '10px' }}>
          取消
        </Button>
        <Button type="primary" onClick={onSubmit}>
          确定
        </Button>
      </div>,
    ]}
    onClose={onCancel}
    {...modalProps}
  >
    <Form {...formProps}>
      {children}
      <Form.Item noStyle>
        <button html-type="submit" style={{ visibility: 'hidden' }} />
      </Form.Item>
    </Form>
  </Drawer>
);
