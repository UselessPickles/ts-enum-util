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
      <>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={onSubmit}>
          确定
        </Button>
      </>,
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
