import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal } from 'antd';
import { useMutation } from 'react-query';
import RESTful from '@/utils/RESTful';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';

export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm();
  const [modalProps, setModalProps] = useState<ModalProps>({});

  return {
    actionRef,
    formRef,
    modalProps,
    setModalProps,
    modalFormRef,
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
  const { modalFormRef, setModalProps, actionRef } = useContainer();

  function submitor() {
    return modalFormRef.validateFields().then((value) => {
      value.file = value?.uploadApk?.[0];
      console.log('requestData', value);
      const { updateWay } = value;
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `此版本将做为最新版本，并${
          updateWay == 0 ? '提示' : '强制'
        }用户更新，是否确定发布？`,
        onOk() {
          useMutation(
            (data: { [key: string]: any }) =>
              RESTful.post('', {
                data,
              }),
            {
              onSuccess: () => {
                actionRef.current?.reload();
                setModalProps({
                  visible: false,
                });
              },
            },
          );
        },
      });
    });
  }

  return { submitor }; //addOrUpdater
}
