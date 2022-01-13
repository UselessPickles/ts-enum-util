import { Card } from 'antd';
import type { FormInstance, FormProps } from 'antd';
import type { LightColumnProps, LightTableProps } from '../LightTable';
import LightTable from '../LightTable';
import type { SearchColumnsProps } from '../Search';
import Search from '../Search';
import type { QueryKey, QueryFunction, UseQueryOptions } from 'react-query';
import { Fullscreen } from '@alitajs/antd-plus';
import useWrap from './hook/useWrap';
import styles from './index.less';

type RequestParameters<RecordType> = Parameters<
  NonNullable<LightTableProps<RecordType>['onChange']>
>;

export interface ActionRef {
  reload?: () => void;
  reloadAndReset?: () => void;
  reset?: () => void;
}

export interface LightTableProColumnProps<RecordType>
  extends LightColumnProps<RecordType>,
    SearchColumnsProps<RecordType> {}
export interface LightTableProProps<RecordType>
  extends Omit<LightTableProps<RecordType>, 'columns'> {
  formRef?: React.MutableRefObject<FormInstance | undefined>;
  formProps?: FormProps;
  columns?: LightTableProColumnProps<RecordType>[];
  manualRequest?: boolean;
  queryKey?: QueryKey;
  queryOptions?: Omit<
    UseQueryOptions<
      | {
          data: RecordType[];
          success: boolean;
          total: number;
          page: number;
        }
      | undefined
    >,
    'queryKey' | 'queryFn'
  >;
  request?: (
    params?: RecordType,
    pagination?: RequestParameters<RecordType>[0],
    sorter?: RequestParameters<RecordType>[2],
    filters?: RequestParameters<RecordType>[1],
    extra?: Parameters<QueryFunction>,
  ) => Promise<{
    data: RecordType[];
    success: boolean;
    total: number;
    page: number;
    summary?: RecordType;
  }>;
  actionRef?: React.MutableRefObject<ActionRef | undefined>;
  headerTitle?: React.ReactNode;
  toolBarRender?: React.ReactNode;
  isFullscreen?: boolean;
  onCloseFullscreen?: () => void;
}

export default function LightTablePro<RecordType extends Record<any, any> = any>({
  columns,
  formRef,
  actionRef,
  formProps,
  queryKey,
  queryOptions,
  request,
  manualRequest,
  pagination,
  headerTitle,
  toolBarRender,
  children,
  isFullscreen,
  onCloseFullscreen,
  ...props
}: LightTableProProps<RecordType>) {
  const { formHandler, tableHandler, actionRef: innerActionRef, formRef: innerFormRef } = useWrap({
    queryKey,
    queryOptions,
    request,
    manualRequest,
    pagination,
  });

  if (formRef) {
    formRef.current = innerFormRef.current;
  }

  if (actionRef) {
    actionRef.current = innerActionRef.current;
  }

  return (
    <div className={`${styles.flex} ${styles.column}`}>
      <Search
        columns={columns}
        formProps={{
          ...formHandler,
          ...formProps,
        }}
      />
      {children ?? <div className={styles.placeholder} />}
      <Card className={`${styles.tableCard}`}>
        <div className={`${styles.flex} ${styles.column}`}>
          <div className={`${styles.flex} ${styles?.['space-between']} ${styles.tableCardHeader}`}>
            <div>{headerTitle}</div>
            <div>{toolBarRender}</div>
          </div>
          <div className={styles.placeholder} />
          <Fullscreen
            enabled={isFullscreen}
            onClose={onCloseFullscreen}
            target={document.querySelector('ant-table-wrapper')}
          >
            <LightTable<RecordType>
              sticky
              columnEmptyText="-"
              bordered
              columns={columns}
              {...tableHandler}
              {...props}
            />
          </Fullscreen>
        </div>
      </Card>
    </div>
  );
}
