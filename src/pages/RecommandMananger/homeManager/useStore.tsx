import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form } from 'antd';
import { useMutation } from 'react-query';
import RESTful from '@/utils/RESTful';

// 共享 hooks
export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm();
  const [modalProps, setModalProps] = useState<ModalProps>({});
  const [editRecord, setEditRecord] = useState<{ [key: string]: any }>({}),
    [page, setPage] = useState<any>(1),
    [loading, setLoading] = useState<boolean>(false),
    [selectGame, setSelectGame] = useState<any>([]);

  return {
    actionRef,
    formRef,
    modalProps,
    setModalProps,
    modalFormRef,
    editRecord,
    setEditRecord,
    page,
    setPage,
    loading,
    setLoading,
    selectGame,
    setSelectGame,
  };
}

export const Context = createContext<ReturnType<typeof useStore> | null>(null);

// useContext语法糖, 用于绕过ts检测
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
  const { modalFormRef, setModalProps, actionRef, editRecord } = useContainer();
  // const addOrUpdater = useMutation(
  //   (data: { [key: string]: any }) =>
  //     RESTful.post('',{
  //       data
  //     }),
  //   {
  //     onSuccess: () => {
  //       actionRef.current?.reload();
  //       setModalProps({
  //         visible: false,
  //       });
  //     },
  //   },
  // );

  function submitor() {
    return modalFormRef.validateFields().then((value) => {});
  }

  return { submitor }; //addOrUpdater
}
