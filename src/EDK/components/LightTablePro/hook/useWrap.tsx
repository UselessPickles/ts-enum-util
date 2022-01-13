import type { FormInstance } from 'antd';
import { Form } from 'antd';
import type { FormProps, PaginationProps } from 'antd';
import type React from 'react';
import { useState, useRef } from 'react';
import type { LightTableProps } from '../../LightTable';
import type { QueryKey, QueryFunction, UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';
import type { ActionRef } from '../';

type RequestParameters<RecordType> = Parameters<
  NonNullable<LightTableProps<RecordType>['onChange']>
>;

type Response<RecordType extends Record<any, any> = any> = {
  data: RecordType[];
  success: boolean;
  total: number;
  page: number;
  summary?: RecordType;
};

interface Parameter<RecordType extends Record<any, any> = any> {
  manualRequest?: boolean;
  queryKey?: QueryKey;
  queryOptions?: Omit<UseQueryOptions<Response | undefined>, 'queryKey' | 'queryFn'>;
  request?: (
    params?: RecordType,
    pagination?: RequestParameters<RecordType>[0],
    sorter?: RequestParameters<RecordType>[2],
    filters?: RequestParameters<RecordType>[1],
    extra?: Parameters<QueryFunction>,
  ) => Promise<Response>;
  pagination?: LightTableProps<RecordType>['pagination'];
}

interface Result<RecordType extends Record<any, any> = any> {
  formHandler: FormProps;
  tableHandler: Omit<LightTableProps<RecordType>, 'columns'>;
  formRef: React.MutableRefObject<FormInstance>;
  actionRef: React.MutableRefObject<ActionRef>;
  current: number;
}

let n = 0;
export default function useWrap<RecordType extends Record<any, any> = any>({
  queryKey,
  queryOptions,
  request,
  manualRequest,
  pagination,
}: Parameter): Result {
  const currentRef = useRef(n++),
    preprocessPagination: PaginationProps | undefined =
      pagination !== false
        ? {
            ...pagination,
            pageSize: pagination?.pageSize ?? pagination?.defaultPageSize ?? 20,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `共 ${total} 条记录 第 ${range?.[0]}/${range?.[1]} 条`,
          }
        : void 0,
    [enabled, setEnabled] = useState(!manualRequest),
    [form] = Form.useForm<RecordType>(),
    [tableState, setTableState] = useState<RequestParameters<RecordType>>(),
    responser = useQuery(
      _safeQueryKey(queryKey),
      async (...extra) =>
        request?.(
          await form.validateFields(),
          tableState?.[0] ?? preprocessPagination,
          tableState?.[2],
          tableState?.[1],
          extra,
        ),
      enabled === false ? { enabled } : queryOptions,
    ),
    formRef = useRef<FormInstance>(form),
    actionRef = useRef<ActionRef>({
      reload: responser.refetch,
      reset: form.resetFields,
      reloadAndReset,
    });

  function _safeQueryKey(q?: QueryKey) {
    const sol = q ?? currentRef.current;
    return ([] as unknown[]).concat(sol, tableState);
  }

  function reloadAndReset() {
    setTableState(void 0);
    form.resetFields();
    responser.refetch();
  }

  function onReset() {
    form.resetFields();
    responser.refetch();
  }

  function onFinish() {
    setEnabled(true);
    setTableState(void 0);
    responser.refetch();
  }

  const onTableChange: LightTableProps<RecordType>['onChange'] = (...rest) => setTableState(rest);

  return {
    formHandler: {
      onReset,
      onFinish,
      form,
    },
    tableHandler: {
      onChange: onTableChange,
      pagination:
        pagination === false
          ? pagination
          : {
              ...preprocessPagination,
              ...tableState?.[0],
              total: responser?.data?.total,
              current: responser?.data?.page,
            },
      dataSource: responser?.data?.data,
      loading: responser?.isFetching,
      total: responser?.data?.summary,
    },
    actionRef,
    formRef,
    current: currentRef.current,
  };
}
