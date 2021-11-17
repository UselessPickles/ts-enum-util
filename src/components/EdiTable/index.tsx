import React, { ReactNode, useState } from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import type { FormListProps } from 'antd/lib/form/FormList';

export interface EdiTableProps<RecordType> {
  formListProps: FormListProps;
  tableProps: TableProps<RecordType>;
  renderFormItem?: () => ReactNode;
}

const { List, Item } = Form;

export default <RecordType extends Record<string, any> = any>({
  formListProps,
  tableProps,
}: EdiTableProps<RecordType>) => {
  const name = formListProps?.name;

  return (
    <List {...formListProps}>
      {(fields, operation, meta) => {
        return (
          <>
            <Item noStyle dependencies={[name]}>
              {({ getFieldValue }) => (
                <Table
                  bordered
                  components={{
                    body: {
                      cell: ({ renderFormItem, ...props }) => {
                        console.log('cell', props);
                        return (
                          <td {...props}>
                            {renderFormItem?.({
                              field: fields?.[props?.fieldName],
                              fields,
                              operation,
                              meta,
                            }) ?? props?.children}
                          </td>
                        );
                      },
                    },
                  }}
                  dataSource={getFieldValue(name)}
                  pagination={false}
                  {...tableProps}
                />
              )}
            </Item>
          </>
        );
      }}
    </List>
  );
};
