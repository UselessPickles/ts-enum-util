import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import RESTful from '@/utils/RESTful';
import { add, edit } from './services';

// 共享 hooks
export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm();
  const [modalProps, setModalProps] = useState<ModalProps>({});
  const [editRecord, setEditRecord] = useState<{ [key: string]: any }>({}),
    [page, setPage] = useState<any>(1),
    [loading, setLoading] = useState<boolean>(false),
    [inputSelect, setInputSelect] = useState<string>(),
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
    inputSelect,
    setInputSelect,
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
    selectGame,
    setSelectGame,
    setEditRecord,
    setInputSelect,
  } = useContainer();
  const { confirm } = Modal;

  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
    setEditRecord({});
    setSelectGame([]);
    setInputSelect(undefined);
  }

  function submitor() {
    return modalFormRef.validateFields().then((value) => {
      console.log('select', selectGame);
      const { sort } = value;
      confirm({
        title: '确认保存游戏吗？',
        icon: <ExclamationCircleOutlined />,
        content: `首页推荐中，第【${sort}】位的游戏将更改为您配置的游戏`,
        async onOk() {
          const { id } = editRecord,
            gameList = selectGame?.[0];
          value.gameName = gameList?.label;
          value.icon = selectGame?.icon;

          let status;
          if (id) {
            await edit({ data: { ...value, id } }).then((res) => {
              status = res?.result.status;
            });
          } else {
            await add({ data: { ...value } }).then((res) => {
              status = res?.result?.status;
            });
          }
          if (status == 1) {
            onCancel();
            actionRef.current?.reload();
          } else {
            throw new Error('请求失败');
          }
        },
        onCancel,
      });
    });
  }

  return { submitor, onCancel }; //addOrUpdater
}
