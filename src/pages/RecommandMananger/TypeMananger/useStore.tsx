import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal } from 'antd';
import { useMutation } from 'react-query';
import { addAPI, updateAPI } from './services';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// 共享 hooks
export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm(),
    [modalProps, setModalProps] = useState<ModalProps>({}),
    [editRecord, setEditRecord] = useState<{ [key: string]: any }>({}),
    [gameModalProps, setGameModalProps] = useState<ModalProps>({}),
    [checkedGames, setCheckedGames] = useState<any>([]),
    [selectedRowKeys, setSelectRowKeys] = useState<any>([]),
    [page, setPage] = useState<any>(1),
    [loading, setLoading] = useState<boolean>(false);

  return {
    actionRef,
    formRef,
    modalProps,
    setModalProps,
    modalFormRef,
    editRecord,
    setEditRecord,
    gameModalProps,
    setGameModalProps,
    checkedGames,
    setCheckedGames,
    selectedRowKeys,
    setSelectRowKeys,
    page,
    setPage,
    loading,
    setLoading,
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
  const {
    modalFormRef,
    setModalProps,
    actionRef,
    editRecord,
    setEditRecord,
    setSelectRowKeys,
    setCheckedGames,
    checkedGames,
  } = useContainer();
  const updater = useMutation((data) => updateAPI({ data }));
  const creater = useMutation((data) => addAPI({ data }));

  const { confirm } = Modal;

  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
    setEditRecord({});
    setSelectRowKeys([]);
    setCheckedGames([]);
  }

  function submitor() {
    return modalFormRef.validateFields().then((value) => {
      confirm({
        title: '确定保存吗？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          const { id } = editRecord;
          value.details = checkedGames?.map((item: { gameNum: any; sort: any; id: any }) => ({
            gameNum: item.gameNum,
            sort: item.sort,
            id: item.id,
          }));

          let data;
          if (id) {
            data = updater.mutateAsync({ ...value, id });
          } else {
            data = creater.mutateAsync(value);
          }
          if (!data) {
            throw new Error('no body');
          }
          onCancel();
          actionRef.current?.reload();
        },
        onCancel,
      });
    });
  }

  return { submitor, onCancel }; //addOrUpdater
}
