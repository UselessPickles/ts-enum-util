import React, { ReactNode, useState } from 'react';
import type { TableColumnsType, TableProps, FormListProps } from 'antd';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
const originData = [];

const { List, Item } = Form;
const { Link } = Typography;

for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableTable = () => {
  const [form] = Form.useForm();

  const columns: TableColumnsType<any> = [
    {
      title: 'name',
      width: '25%',
      renderFormItem: ({ field, fields, operation, meta }) => {
        return (
          <Item {...field} name={[field?.name, 'name']}>
            <Input />
          </Item>
        );
      },
    },
    {
      title: 'age',
      width: '15%',
      renderFormItem: ({ field, fields, operation, meta }) => {
        return (
          <>
            <Item {...field} name={[field?.name, 'age']}>
              <Input />
            </Item>
          </>
        );
      },
    },
    {
      title: 'address',
      width: '40%',
      renderFormItem: ({ field, fields, operation, meta }) => {
        return (
          <Item {...field} name={[field?.name, 'address']}>
            <Input />
          </Item>
        );
      },
    },
    {
      title: 'operation',
      renderFormItem: ({ field, fields, operation, meta }) => {
        return (
          <Item {...field} name={[field?.name, 'operation']} rules={[{ required: true }]}>
            <Input />
          </Item>
        );
      },
    },
  ].map((col) => ({
    ...col,
    onCell: (_, idx) => {
      return {
        title: col?.title,
        fieldName: idx,
        renderFormItem: col?.renderFormItem,
      };
    },
  }));

  return (
    <Form form={form} initialValues={{ test: originData }} onFinish={console.log}>
      <List name={'test'}>
        {(fields, operation, meta) => {
          return (
            <>
              <Item noStyle dependencies={[['test']]}>
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
                    dataSource={getFieldValue(['test'])}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                  />
                )}
              </Item>

              <Link
                onClick={() =>
                  operation.add({
                    key:
                      fields?.reduce((max, field) => (max > field?.name ? max : field?.name), 0) +
                      1,
                  })
                }
              >
                + add
              </Link>
            </>
          );
        }}
      </List>

      <Item hidden>
        <button html-type="submit" />
      </Item>
    </Form>
  );
};

export default EditableTable;
