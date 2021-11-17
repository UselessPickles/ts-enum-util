import { Input, Form, Typography } from 'antd';
import type { EdiTableColumnType } from '@/components/EdiTable';
import EdiTable from '@/components/EdiTable';
import { MenuOutlined } from '@ant-design/icons';
const originData: any = [];

const { Item } = Form;
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

  const columns: EdiTableColumnType<any>[] = [
    {
      canDrag: true,
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
    {
      title: 'name',
      width: '25%',
      renderFormItem: ({ field }) => {
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
      renderFormItem: ({ field }) => {
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
      renderFormItem: ({ field }) => {
        return (
          <Item {...field} name={[field?.name, 'address']}>
            <Input />
          </Item>
        );
      },
    },
    {
      width: '5%',
      title: 'operation',
      renderFormItem: ({ field, operation }) => {
        return (
          <Item {...field}>
            <Link onClick={() => operation.remove(field.name)}>删除</Link>
          </Item>
        );
      },
    },
  ];

  return (
    <Form form={form} initialValues={{ test: originData }} onFinish={console.log}>
      <EdiTable formListProps={{ name: 'test' }} tableProps={{ columns, bordered: true }}>
        {({ body, operation }) => {
          return (
            <>
              {body}
              <Item>
                <Link onClick={() => operation.add()}> + 新增</Link>
              </Item>
            </>
          );
        }}
      </EdiTable>

      <Item hidden>
        <button html-type="submit" />
      </Item>
    </Form>
  );
};

export default EditableTable;
