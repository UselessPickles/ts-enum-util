import { Button, Form } from 'antd';
import GameSelectV2 from '@/components/GameSelectV2';
const { Item } = Form;

export default () => (
  <Form onFinish={console.log}>
    <Item name="gameSelectV2">
      <GameSelectV2 />
    </Item>
    <Item>
      <Button htmlType="submit">Submit</Button>
    </Item>
  </Form>
);
