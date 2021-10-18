import { ProCoreActionType } from '@ant-design/pro-utils';
import { Form, FormInstance } from 'antd';
import { ProTableProps } from '@ant-design/pro-table';
import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import { XmilesCol } from '../Col';
import XmilesTable from '../Table';
import XmilesSearch, { isValidValue } from '../Search';

const Space = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;
`;

export interface XmilesTableProps<
  T,
  U extends {
    [key: string]: any;
  },
> extends Omit<ProTableProps<T, U>, 'columns'> {
  columns?: XmilesCol<T>[];
}

export default <
  T,
  U extends {
    [key: string]: any;
  } = {},
>({
  columns,
  formRef,
  actionRef,
  form,
  request,
  manualRequest,
  ...props
}: XmilesTableProps<T, U>) => {
  const visCount = useRef(1);
  const [innerform] = Form.useForm(),
    col: XmilesCol[] = columns || [],
    tableRef = useRef(null),
    forwardActionRef = useRef<ProCoreActionType>();

  if (formRef as React.MutableRefObject<FormInstance>) {
    (formRef as React.MutableRefObject<FormInstance>).current = innerform;
  }

  if (actionRef) {
    (actionRef as React.MutableRefObject<ProCoreActionType> as any).current =
      forwardActionRef?.current;
  }

  const injectProps: ProTableProps<T, U> = {};

  if (typeof request === 'function') {
    injectProps.request = (p, ...args) => {
      if (visCount.current >= 1 && manualRequest) {
        visCount.current--;
        return Promise.resolve({
          data: [],
          success: true,
          total: 0,
          page: 1,
        });
      }
      const params = innerform?.getFieldsValue();

      return request({ ...params, ...p }, ...args);
    };
  }

  function reload() {
    (forwardActionRef as React.MutableRefObject<ProCoreActionType>).current?.reloadAndRest?.();
  }

  function columnEmptyTextHOF(col: XmilesCol): XmilesCol['render'] {
    return (...args) => {
      const preRender = col?.render?.(...args);
      return preRender
        ? preRender
        : isValidValue(args?.[1]?.[col?.dataIndex as string])
        ? args?.[0]
        : '-';
    };
  }

  function enhanceCol(cols?: XmilesCol[]) {
    return cols?.map((col) => ({ ...col, render: columnEmptyTextHOF(col) }));
  }

  return (
    <Space>
      <XmilesSearch
        columns={col}
        formProps={{ onFinish: reload, onReset: reload, ...form, form: innerform }}
      />

      <div
        ref={tableRef}
        style={{
          flex: 1,
          height: '100%',
          // overflow: 'visible',
        }}
      >
        <XmilesTable<FC<XmilesTableProps<T, U>>>
          // 工具栏注入， 是否应该允许重载？ 是！
          options={{
            setting: true,
            fullScreen: true,
            reload: false,
            density: false,
          }}
          sticky={{
            offsetHeader: -16,
          }}
          columnEmptyText="-"
          bordered
          {...props}
          scroll={{
            x: 'max-content',
            // 两份header 64px *2, 一份分页 32px*1，1份padding 16px*1
            // y: (rect?.height || 0) - 64 * 2 - 32 - 16,
          }}
          actionRef={forwardActionRef}
          columns={enhanceCol(col)}
          // 分页注入， 是否应该允许重载？p
          pagination={{
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条记录 第 ${range?.[0]}/${range?.[1]} 条`,
            size: 'default',
          }}
          search={false}
          {...injectProps}
        />
      </div>
    </Space>
  );
};
