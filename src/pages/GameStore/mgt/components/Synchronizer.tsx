import { Image, Tag, Typography } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import type { Row } from './DescriptionsRender';
import { DescriptionsRender } from './DescriptionsRender';
import { INSTALL_TYPE, SHOW_STATUS } from '../models';
import { str2arr } from '@/decorators/Format/converter';
import getFileNameInPath from '@/utils/file/getFileNameInPath';
import { services as classifyServices } from '../services/classify';
import { useQuery } from 'react-query';

const { Text } = Typography;

export default ({
  formProps,
  modalProps,
  data = {},
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const { dataSource } = data;

  const classify = useQuery<{ data: { id: number; name: string }[] }>(
    ['game-mgt-classify-list'],
    () => classifyServices.list(),
    { refetchOnWindowFocus: false },
  );

  const classifyMap = classify?.data?.data?.reduce(
    (acc, cur: any) => acc.set(`${cur.id}`, cur.name),
    new Map(),
  );

  const rows: Row<any>[] = [
    {
      name: '_status',
      label: '状态',
      format: (_status: string) => {
        return _status === 'prod' ? (
          <Tag>线上内容</Tag>
        ) : (
          <>
            <Tag color="success">测试库内容</Tag>
            <Text type="success">（将作为新版本替换线上内容）</Text>
          </>
        );
      },
    },

    { name: 'gameName', label: '游戏名称' },
    { name: 'briefIntroduction', label: '一句话介绍' },
    {
      name: 'detailedIntroduction',
      label: '详细介绍',
      format: (src) => <div dangerouslySetInnerHTML={{ __html: src }} />,
    },
    {
      name: 'gameIcon',
      label: '游戏Icon',
      format: (src) => src && <Image width="60px" src={src} />,
    },
    {
      name: 'dynamicPicture',
      label: '游戏动态图',
      format: (src) => src && <Image width="60px" src={src} />,
    },
    {
      name: 'gamePictureList',
      label: '游戏截图',
      format: (srcs: { img: string }[]) =>
        srcs?.map?.((src) => <Image width="60px" src={src?.img} key={src?.img} />),
    },
    {
      name: ['gameVideoList', 0, 'url'],
      label: '游戏视频',
      format: (src: string) =>
        src && (
          <video width="200px" src={src} controls>
            你的浏览器不支持此视频 <a href={src}>视频链接</a>
          </video>
        ),
    },
    {
      name: ['gameVideoList', 0, 'img'],
      label: '视频封面图',
      format: (src: string) => src && <Image width="60px" src={src} />,
    },
    { name: 'score', label: '游戏评分' },
    {
      name: 'isShow',
      label: '在首页展示',
      format: (v: number) => SHOW_STATUS.get(v),
    },
    { name: 'thirdGameClassify', label: '第三方游戏分类' },
    {
      name: 'gameClassifyId',
      label: 'APP中游戏分类',
      format: (strs) =>
        str2arr(strs)
          ?.map((str: string) => classifyMap?.get(str))
          ?.join(','),
    },
    { name: 'apk', label: '游戏apk', format: getFileNameInPath },
    { name: 'insideVersion', label: '内部版本号' },
    { name: 'externalVersion', label: '外部版本号' },
    { name: 'md5', label: 'MD5' },
    { name: 'gameBit', label: '游戏位数' },
    {
      name: 'installType',
      label: '安装方式',
      format: (v: number) => INSTALL_TYPE.get(v),
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
