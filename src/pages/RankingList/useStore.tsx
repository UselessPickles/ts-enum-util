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
    [inputSelect, setInputSelect] = useState<string>(),
    [page, setPage] = useState<any>(1),
    [selectGame, setSelectGame] = useState<any>([]),
    [loading, setLoading] = useState<boolean>(false);
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
    setLoading,
    loading,
    inputSelect,
    setInputSelect,
    page,
    setPage,
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

export function useModalFromSubmit() {
  const { modalFormRef, setModalProps, actionRef } = useContainer();

  function submitor() {
    return modalFormRef.validateFields().then((value) => {
      value.status = 1;
      value.appVersion = Number(value?.appVersionCode?.replace(/(^0.|\.)/g, '') ?? 0);
      const { updateType } = value;
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `此版本将做为最新版本，并${
          updateType == 2 ? '提示' : '强制'
        }用户更新，是否确定发布？`,
        async onOk() {
          // await upload({ data: { ...value } }).then((res) => {
          //   if (res?.result?.status == 1) {
          //     actionRef.current?.reload();
          //     setModalProps({
          //       visible: false,
          //     });
          //     modalFormRef.resetFields();
          //     setWarning(undefined);
          //   }
          // });
        },
        onCancel() {},
      });
    });
  }

  return { submitor };
}
