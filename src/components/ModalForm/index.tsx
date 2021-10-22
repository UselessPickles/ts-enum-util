import type { PropsWithChildren } from 'react';
import React from 'react';
import { Modal, Form } from 'antd';
import type { InitValue } from '@/hooks/useModalForm';

export default ({ children, modalProps, formProps }: PropsWithChildren<InitValue>) => (
  <Form {...formProps}>
    <Modal {...modalProps}>
      {children}
      <Form.Item noStyle>
        <button html-type="submit" style={{ visibility: 'hidden' }} />
      </Form.Item>
    </Modal>
  </Form>
);
