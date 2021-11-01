import { Image, Tag, Typography } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import type { Row } from './DescriptionsRender';
import { DescriptionsRender } from './DescriptionsRender';
import { STATUS } from '../models';

const { Text } = Typography;

export default ({
  formProps,
  modalProps,
  data = {},
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const { dataSource } = data;

  const rows: Row<any>[] = [
    {
      field: 'status',
      title: '状态',
      render: (text: number) => {
        return !text ? (
          <Tag>线上内容</Tag>
        ) : (
          <>
            <Tag color="success">测试库内容</Tag>
            <Text type="success">（将作为新版本替换线上内容）</Text>
          </>
        );
      },
    },
    { field: 'gameName', title: '游戏名称' },
    { field: 'insideVersion', title: '版本号' },
    { field: 'briefIntroduction', title: '一句话介绍' },
    { field: 'detailedIntroduction', title: '详细介绍' },
    {
      field: 'gameIcon',
      title: '游戏icon',
      render: (src) => <Image width="60px" src={src} />,
    },
  ];

  return (
    <ModalForm
      formProps={formProps}
      modalProps={{
        title: '同步到线上',
        okText: '确定同步',

        ...modalProps,
        width: 960,
      }}
    >
      <DescriptionsRender bordered dataSource={dataSource} rows={rows} />
    </ModalForm>
  );
};
