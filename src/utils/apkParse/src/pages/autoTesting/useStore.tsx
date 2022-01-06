import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal } from 'antd';
// import { useMutation } from 'react-query';
// import { addAPI, updateAPI } from './services';
// import { ExclamationCircleOutlined } from '@ant-design/icons';

// 共享 hooks
export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm(),
    [modalProps, setModalProps] = useState<ModalProps>({}),
    [editRecord, setEditRecord] = useState<{ [key: string]: any }>({});

  return {
    actionRef,
    formRef,
    modalProps,
    setModalProps,
    modalFormRef,
    editRecord,
    setEditRecord,
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
  const { modalFormRef, setModalProps, actionRef, editRecord, setEditRecord } = useContainer();
  // const updater = useMutation((data) => updateAPI({ data }));
  // const creater = useMutation((data) => addAPI({ data }));

  const { confirm } = Modal;

  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
    setEditRecord({});
  }

  function submitor() {
    // return modalFormRef.validateFields().then((value: void) => {
    //   confirm({
    //     title: '确定保存吗？',
    //     icon: <ExclamationCircleOutlined />,
    //     onOk() {
    //       const { id } = editRecord;
    //       let data;
    //       if (id) {
    //         data = updater.mutateAsync({ ...value, id });
    //       } else {
    //         data = creater.mutateAsync(value);
    //       }
    //       if (!data) {
    //         throw new Error('no body');
    //       }
    //       onCancel();
    //       actionRef.current?.reload();
    //     },
    //     onCancel,
    //   });
    // });
  }

  return { submitor, onCancel }; //addOrUpdater
}
