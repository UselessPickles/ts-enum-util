import { createContext, useContext, useRef, useState } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { FormInstance } from 'antd/lib/form';
import { Form, Table } from 'antd';
import { useMutation } from 'react-query';
import RESTful from '@/utils/RESTful';
import styled from 'styled-components';
import { addAPI, updateAPI } from './services';

// 共享 hooks
export function useStore() {
  const actionRef = useRef<ProCoreActionType | undefined>();
  const formRef = useRef<FormInstance | undefined>();
  const [modalFormRef] = Form.useForm(),
    [modalProps, setModalProps] = useState<ModalProps>({}),
    [editRecord, setEditRecord] = useState<{ [key: string]: any }>({}),
    [gameModalProps, setGameModalProps] = useState<ModalProps>({}),
    [checkedGames, setCheckedGames] = useState<any>([]),
    [selectedRowKeys, setSelectRowKeys] = useState<any>([]);

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
  const updater = useMutation((data) => updateAPI({ data }));
  const creater = useMutation((data) => addAPI({ data }));

  function submitor() {
    return modalFormRef.validateFields().then((value) => {
      const { id } = value;
      let data;
      if (id) {
        data = updater.mutateAsync(value);
      } else {
        data = creater.mutateAsync(value);
      }
    });
  }

  return { submitor }; //addOrUpdater
}

export function gameTable() {
  const GameTable = styled(Table)`
    thead {
      display: none;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 0 !important;
    }
    .ant-table-tbody > tr.ant-table-row-selected > td {
      background-color: #ffffff !important;
    }
  `;
  return { GameTable };
}
