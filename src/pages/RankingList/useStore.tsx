import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal } from 'antd';
import type { DrawerProps } from 'antd';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';

export interface CustomDrawerProps extends DrawerProps {
  onOk?: (...args: any[]) => void;
  confirmLoading?: boolean;
}

export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>(),
    formRef = useRef<FormInstance | undefined>(),
    [editRecord, setEditRecord] = useState<{ [key: string]: any }>({}),
    [modalFormRef] = Form.useForm(),
    [modalProps, setModalProps] = useState<ModalProps>({}),
    [selectGame, setSelectGame] = useState<any>([]);
  const [drawerProps, setDrawerProps] = useState<CustomDrawerProps>({
    width: 800,
    placement: 'right',
  });

  return {
    actionRef,
    formRef,
    editRecord,
    setEditRecord,
    modalProps,
    setModalProps,
    modalFormRef,
    selectGame,
    setSelectGame,
    drawerProps,
    setDrawerProps,
  };
}

export const Context = createContext<ReturnType<typeof useStore> | null>(null);

export function useContainer() {
  const value = useContext(Context);
  if (value === null) {
    throw new Error('useContext语法糖, 用于绕过ts检测');
  }
  return value;
}

export default {
  useStore,
  useContainer,
  Context,
};
