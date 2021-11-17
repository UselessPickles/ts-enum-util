import type { ReactNode } from 'react';
import type { TableProps } from 'antd';
import { Table, Form } from 'antd';
import type { FormListProps } from 'antd/lib/form/FormList';
import type { ColumnType } from 'antd/lib/table';

import styles from './index.less';

type FormListChildrenParams = Parameters<FormListProps['children']>;
interface FormListChildrenParamsInterface {
  fields: FormListChildrenParams[0];
  operation: FormListChildrenParams[1];
  meta: FormListChildrenParams[2];
}

export type RenderFormItem = (
  params: { field: FormListChildrenParams[0][number] } & FormListChildrenParamsInterface,
) => ReactNode;

export interface EdiTableColumnType<P> extends ColumnType<P> {
  renderFormItem?: RenderFormItem;
}
export interface EdiTableProps<RecordType> {
  formListProps: Omit<FormListProps, 'children'>;
  tableProps: Omit<TableProps<RecordType>, 'columns'> & {
    columns: EdiTableColumnType<RecordType>[];
  };
  children?: (
    params: {
      body: ReactNode;
    } & FormListChildrenParamsInterface,
  ) => ReactNode;
}

const { List, Item, ErrorList } = Form;

export default <RecordType extends Record<string, any> = any>({
  formListProps,
  tableProps,
  children,
}: EdiTableProps<RecordType>) => {
  const name = formListProps?.name;
  const { columns, ...restTableProps } = tableProps;
  const injectColumns: any = columns?.map?.(({ renderFormItem, ...column }) => ({
    ...column,
    onCell: (_: any, idx: any) => ({
      renderFormItem,
      fieldName: idx,
    }),
  }));

  return (
    <div className={styles.editable}>
      <List {...formListProps}>
        {(fields, operation, meta) => {
          const body = (
            <>
              <Item noStyle dependencies={[name]}>
                {({ getFieldValue }) => (
                  <Table
                    components={{
                      body: {
                        cell: ({
                          renderFormItem,
                          fieldName,
                          ...props
                        }: {
                          renderFormItem: RenderFormItem;
                          [key: string]: any;
                        }) => (
                          <td {...props}>
                            {renderFormItem?.({
                              field: fields?.[fieldName],
                              fields,
                              operation,
                              meta,
                            }) ?? props?.children}
                          </td>
                        ),
                      },
                    }}
                    dataSource={getFieldValue(name)}
                    pagination={false}
                    columns={injectColumns}
                    {...restTableProps}
                  />
                )}
              </Item>
              <ErrorList errors={meta?.errors} />
            </>
          );

          return children?.({ body, fields, operation, meta }) ?? body;
        }}
      </List>
    </div>
  );
};
