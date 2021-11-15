import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableTable = () => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      // editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
    },
  ];

  return (
    <Form form={form}>
      <Table
        components={{
          // table: (props, ...args) => {
          //   console.log('table', props, ...args)
          //   return <table  >
          //     {/* {props?.children?.[0]} */}
          //     {/* {props?.children?.[2]} */}
          //     {props?.children?.[1]}
          //     {props?.children?.[3]}
          //   </table>
          // },
          body: {
            wrapper: (props) => {
              console.log('body, wrapper', props);
              return <tbody className={props?.className}>{props?.children}</tbody>;
            },
            // row: (props, ...args) => {
            // console.log('body, row', props, ...args)
            // return <tr {...props} />
            // },
            // // cell: (props, ...args) => {
            // // console.log('body, cell', props, ...args)
            // // return <td {...props} />
            // // },
          },
        }}
        bordered
        dataSource={originData}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;
