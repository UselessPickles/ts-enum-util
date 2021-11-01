import type { DatePickerProps } from 'antd';
import {
  Form,
  message,
  Radio,
  Input,
  Modal,
  Space,
  Button,
  DatePicker,
  Checkbox,
  Descriptions,
  Tabs,
  Typography,
  InputNumber,
  Card,
  Divider,
  Upload,
  Image,
  Timeline,
  Tag,
} from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { services } from '../../services';
import { services as classifyServices } from '../../services/classify';
import Options from '@/utils/Options';
import type { ENV } from '../../models';
import type Row from '../../models';
import { PROFIT_MODE, INSTALL_TYPE, STATUS, TYPE } from '../../models';
import SearchSelect from '@/components/SearchSelect';
import FormItemView from '@/components/FormItemView';
import CustomUpload from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';

import type { Moment } from 'moment';
import moment from 'moment';
import theme from '@/../config/theme';
import { useQuery, useQueryClient } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import SelectAll from '@/decorators/Select/SelectAll';

import { beforeUpload, extra } from '../utils';
import getExt from '@/utils/file/getExt';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  getValueFromEvent,
  uploadEvent2str,
  str2fileList,
  uploadEvent2strArr,
  strArr2fileList,
  arr2str,
  str2arr,
  moment2str,
  str2moment,
} from '@/decorators/Format/converter';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import getIn from '@/utils/getIn';
import type { Key } from '@/utils/setTo';
import setTo from '@/utils/setTo';
import getFileNameInPath from '@/utils/file/getFileNameInPath';
import Mask from '@/components/Mask';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';

const { 'primary-color': primaryColor } = theme;

const { Item } = Form;
const { TabPane } = Tabs;
const { Text } = Typography;
const { Item: DItem } = Descriptions;
const { Item: TItem } = Timeline;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
  data = {},
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const { id, env } = data;
  const detail = useQuery(
    ['game-mgt-editor', data.id],
    () => services('get', { data: { id } }, env),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      onSuccess(res) {
        const formData = prune(res?.data, isValidValue) ?? {};

        form.setFieldsValue(formData);
        setModalProps((pre) => ({
          ...pre,
          title: formData?.packageName,
          confirmLoading: undefined,
        }));
      },
    },
  );

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      const { versionList, ...format } = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定保存游戏内容吗？再次确定保存成功',
        onOk: async () => {
          try {
            setModalProps((pre) => ({ ...pre, confirmLoading: true }));
            await services(
              'update',
              {
                data: format,
                throwErr: true,
              },
              env,
            );
            await onSuccess?.();
            setModalProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            if (e?.message) {
              message.error(e?.message);
            }
            throw e;
          } finally {
            setModalProps((pre) => ({ ...pre, confirmLoading: false }));
          }
        },
      });
    } catch (e: any) {
      const { errorFields } = e ?? {};
      const errMsgs = errorFields?.reduce(
        (acc: string[], field: any) => acc.concat(field?.errors),
        [],
      );
      message.error(
        <>
          <b>表单存在以下错误</b>
          <br />
          {errMsgs?.map((msg: string) => (
            <>
              {msg} <br />
            </>
          ))}
        </>,
      );
    }
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: { tab: '游戏资料' },
        className: styles['form-item-margin-bottom'],
        title: detail?.isFetched ? '加载中...' : undefined,
        ...formProps,
      }}
      modalProps={{
        onOk: onSubmit,
        className: styles['modal-title-height'],
        confirmLoading: detail?.isFetched,
        ...modalProps,
        title: (
          <>
            {modalProps?.title}
            <Form form={formProps?.form} component={false}>
              <Item name="tab" valuePropName="activeKey" style={{ position: 'absolute' }}>
                <Tabs>
                  {Options(TYPE).toOpt?.map((opt) => (
                    <TabPane tab={opt.label} key={opt.value} />
                  ))}
                </Tabs>
              </Item>
            </Form>
          </>
        ),
      }}
    >
      <Item dependencies={[['tab']]} noStyle>
        {({ getFieldValue }) => {
          const t = getFieldValue(['tab']);
          return (
            <>
              <Item name={'id'} hidden>
                <Input />
              </Item>
              <Item noStyle hidden={t !== '游戏资料'}>
                <GameInfo />
              </Item>
              <Item noStyle hidden={t !== '资源信息'}>
                <SourceInfo env={env} />
              </Item>
              <Item noStyle hidden={t !== '商务信息'}>
                <BizInfo />
              </Item>
              <Item noStyle hidden={t !== '更新记录'} name={'versionList'}>
                <UpdateRecord env={env} />
              </Item>
            </>
          );
        }}
      </Item>
    </ModalForm>
  );
};

// 游戏资料
function GameInfo() {
  const classify = useQuery<{ data: { id: number; name: string }[] }>(
    ['game-mgt-classify-list'],
    () => classifyServices('list')({ data: {} }),
    { refetchOnWindowFocus: false },
  );

  const classifyMap = classify?.data?.data?.reduce(
    (acc, cur: any) => acc.set(`${cur.id}`, cur.name),
    new Map(),
  );

  return (
    <>
      <Item>
        <Text strong>1. 基础信息</Text>
      </Item>
      <Item name="gameName" label="游戏名称" rules={[{ required: true }]}>
        <Input placeholder="输入内容" />
      </Item>
      <Item name="briefIntroduction" label="一句话介绍" rules={[{ required: true }]}>
        <Input placeholder="输入内容" />
      </Item>
      <Item name="detailedIntroduction" label="详细介绍" rules={[{ required: true }]}>
        <Input.TextArea placeholder="输入内容" rows={5} />
      </Item>
      <div style={{ display: 'flex' }}>
        <Item dependencies={[['gameIcon']]} noStyle>
          {({ getFieldValue }) => {
            return (
              <Item
                name="gameIcon"
                label="游戏Icon"
                rules={[{ required: true }]}
                style={{ flex: 1 }}
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                normalize={uploadEvent2str}
              >
                {compose<ReturnType<typeof CustomUpload>>(
                  IOC([
                    Format({
                      valuePropName: 'fileList',
                      g: str2fileList,
                    }),
                  ]),
                )(
                  <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                    {!(getFieldValue(['gameIcon'])?.length >= 1) && (
                      <div>
                        <PlusOutlined style={{ fontSize: '18px' }} />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                      </div>
                    )}
                  </CustomUpload>,
                )}
              </Item>
            );
          }}
        </Item>

        <Item dependencies={[['dynamicPicture']]} noStyle>
          {({ getFieldValue }) => (
            <Item
              name="dynamicPicture"
              label="游戏动态图"
              style={{ flex: 1 }}
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              normalize={uploadEvent2str}
            >
              {compose<ReturnType<typeof CustomUpload>>(
                IOC([
                  Format({
                    valuePropName: 'fileList',

                    g: str2fileList,
                  }),
                ]),
              )(
                <CustomUpload maxCount={1} accept=".gif" listType="picture-card">
                  {!(getFieldValue(['dynamicPicture'])?.length >= 1) && (
                    <div>
                      <PlusOutlined style={{ fontSize: '18px' }} />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </CustomUpload>,
              )}
            </Item>
          )}
        </Item>
      </div>
      <Item dependencies={[['gamePictureList']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name="gamePictureList"
            label="游戏截图"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            normalize={uploadEvent2strArr}
            extra="为App更好的展示效果，请上传至少三张游戏截图"
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',

                  g: strArr2fileList,
                }),
              ]),
            )(
              <CustomUpload maxCount={5} accept=".jpg,.png" listType="picture-card" multiple>
                {!(getFieldValue(['gamePictureList'])?.length >= 5) && (
                  <div>
                    <PlusOutlined style={{ fontSize: '18px' }} />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </CustomUpload>,
            )}
          </Item>
        )}
      </Item>

      <div style={{ display: 'flex' }}>
        <Item shouldUpdate={shouldUpdateManyHOF([['gameVideoList', 0, 'url']])} noStyle>
          {({ getFieldValue }) => {
            const url = getFieldValue(['gameVideoList', 0, 'url']);
            return (
              <Item
                name={['gameVideoList', 0, 'url']}
                label="游戏视频"
                style={{ flex: 1 }}
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                normalize={uploadEvent2str}
              >
                {compose<ReturnType<typeof CustomUpload>>(
                  IOC([
                    Format({
                      valuePropName: 'fileList',
                      g: str2fileList,
                    }),
                  ]),
                )(
                  <CustomUpload
                    maxCount={1}
                    accept="video/*"
                    listType="picture-card"
                    itemRender={(origin, file, ___, actions) => {
                      return file?.status === 'uploading' ? (
                        origin
                      ) : (
                        <Mask
                          containerProps={{
                            style: {
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                            },
                          }}
                          toolbarProps={{
                            children: (
                              <Space
                                style={{ fontSize: '16px', color: 'rgba(255,255,255)' }}
                                size={8}
                              >
                                <EyeOutlined onClick={actions?.download} />
                                <DeleteOutlined onClick={actions?.remove} />
                              </Space>
                            ),
                          }}
                        >
                          <video src={url} width="100%" height="100%">
                            你的浏览器不支持此视频 <a href={url}>视频链接</a>
                          </video>
                        </Mask>
                      );
                    }}
                  >
                    {!(url?.length >= 1) && (
                      <div>
                        <PlusOutlined style={{ fontSize: '18px' }} />
                        <div style={{ marginTop: 8 }}>上传视频</div>
                      </div>
                    )}
                  </CustomUpload>,
                )}
              </Item>
            );
          }}
        </Item>
        <Item dependencies={[['gameVideoList', 0, 'img']]} noStyle>
          {({ getFieldValue }) => {
            return (
              <Item
                name={['gameVideoList', 0, 'img']}
                label="视频封面图"
                style={{ flex: 1 }}
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                normalize={uploadEvent2str}
              >
                {compose<ReturnType<typeof CustomUpload>>(
                  IOC([
                    Format({
                      valuePropName: 'fileList',

                      g: str2fileList,
                    }),
                  ]),
                )(
                  <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                    {!(getFieldValue(['gameVideoList', 0, 'img'])?.length >= 1) && (
                      <div>
                        <PlusOutlined style={{ fontSize: '18px' }} />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                      </div>
                    )}
                  </CustomUpload>,
                )}
              </Item>
            );
          }}
        </Item>
      </div>

      <Item name="score" label="游戏评分">
        <InputNumber placeholder="输入内容" min={0} max={10} style={{ width: '100%' }} />
      </Item>

      <Item>
        <Text strong>2. 基础信息</Text>
      </Item>
      <Item name="thirdGameClassify" label="第三方游戏分类">
        <FormItemView />
      </Item>
      <Item name="gameClassifyId" label="APP中游戏分类" rules={[{ required: true }]}>
        {compose<ReturnType<typeof SearchSelect>>(
          IOC([
            SelectAll,
            Format({
              f: arr2str,
              g: str2arr,
            }),
          ]),
        )(<SearchSelect mode="multiple" showArrow options={Options(classifyMap)?.toOpt} />)}
      </Item>
    </>
  );
}

// 资源信息
function SourceInfo({ env }: { env: ENV }) {
  return (
    <>
      <Item
        name={['apk']}
        label="游戏apk"
        valuePropName="fileList"
        getValueFromEvent={getValueFromEvent}
        normalize={uploadEvent2str}
      >
        {compose<ReturnType<typeof CustomUpload>>(
          IOC([
            Format({
              valuePropName: 'fileList',
              g: str2fileList,
            }),
          ]),
        )(
          <CustomUpload
            disabled={env === 'prod'}
            maxCount={1}
            accept=".apk,.aab"
            beforeUpload={beforeUpload}
            // customRequest={async ({ onSuccess, onError, file }) => {
            //   try {
            //     // const data = await RESTful.get('', {
            //     //   fullUrl: `/intelligent-manager/api/material/getQiniuToken?fileNameList=${tokenKey}`,
            //     //   throwErr: true,
            //     // }).then((res) => res?.data);

            //     // if (!data) {
            //     //   throw new Error('上传失败');
            //     // }

            //     // const fd = new FormData();
            //     // fd.append('file', file);
            //     // fd.append('token', data?.[tokenKey]);
            //     // fd.append('key', tokenKey);

            //     // await fetch('https://upload.qiniup.com', {
            //     //   method: 'POST',
            //     //   body: fd,
            //     // });

            //     const xhr = new XMLHttpRequest();

            //     if ((Math.random() * 100) % 2) {
            //       onSuccess?.(`https://image.quzhuanxiang.com/${123}.aab`, xhr);
            //     } else {
            //       onError?.(new Error('error'));
            //     }
            //   } catch (e: any) {
            //     onError?.(e);
            //   }
            // }}
            showUploadList={{
              showDownloadIcon: false,
              showRemoveIcon: false,
            }}
            itemRender={(origin, file) => {
              return (
                <Card style={{ marginTop: '4px', backgroundColor: '#fafafa' }} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {origin}
                    <Button icon={<DownloadOutlined />} onClick={() => window.open(file?.url)}>
                      下载{getExt(file?.name ?? '')}文件
                    </Button>
                  </div>
                  <Divider style={{ margin: '12px 0', backgroundColor: '#fafafa' }} />

                  <Item name={['insideVersion']} label="内部版本号：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['externalVersion']} label="外部版本号：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['md5']} label="MD5：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['gameBit']} label="游戏位数：" {...extra}>
                    <FormItemView />
                  </Item>
                </Card>
              );
            }}
          >
            <Button icon={<UploadOutlined />} disabled={env === 'prod'}>
              上传apk文件
            </Button>
          </CustomUpload>,
        )}
      </Item>

      <Item name={['packageName']} label="包名" rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item name={['insideVersion']} label="内部版本号" rules={[{ required: true }]}>
        <Input />
      </Item>

      <Item dependencies={[['apk']]} noStyle>
        {({ getFieldValue }) => {
          const isAAB = getFieldValue(['apk'])?.endsWith?.('.aab');
          return (
            <Item
              name={['installType']}
              label="安装方式"
              rules={[{ required: true }]}
              extra={isAAB && 'aab格式仅能内部安装，安卓手机装不了此格式包'}
            >
              <Radio.Group
                disabled={env === 'prod' || isAAB}
                options={Options(INSTALL_TYPE)?.toOpt}
                optionType="button"
              />
            </Item>
          );
        }}
      </Item>
    </>
  );
}

// 商务信息
function BizInfo() {
  function range(start: number, end: number) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledDate: DatePickerProps['disabledDate'] = (current) => {
    return current && current < moment().minutes(1);
  };

  const disabledTime = () => {
    return {
      disabledHours: () => range(0, moment().hours()),
      disabledMinutes: () => range(0, moment().minutes()),
      disabledSeconds: () => range(0, moment().seconds()),
    };
  };

  return (
    <>
      <Item name="status" label="上线状态" rules={[{ required: true }]}>
        <SearchSelect options={Options(STATUS).toOpt} />
      </Item>

      <Item
        name={['timingUpdateTime']}
        label="定时更新"
        rules={[
          {
            validator: (_, time: Moment) => {
              if (time && time <= moment()) {
                return Promise.reject(new Error('不能小于当前时间'));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        {compose<any>(IOC([Format({ f: moment2str, g: str2moment })]))(
          <DatePicker showTime disabledDate={disabledDate} disabledTime={disabledTime} />,
        )}
      </Item>

      <Item name={['profitMode']} label="盈利方式">
        {compose<ReturnType<typeof SearchSelect>>(
          IOC([
            Format({
              f: arr2str,
              g: str2arr,
            }),
          ]),
        )(<Checkbox.Group options={Options(PROFIT_MODE).toOpt} />)}
      </Item>

      <Item name={['updateContent']} label="更新内容">
        <Input.TextArea placeholder="输入内容" />
      </Item>

      <Item name={['publicationNo']} label="出版物号（ISBN号）">
        <Input placeholder="输入内容" />
      </Item>
      <Item dependencies={[['publicationOrder']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name={['publicationOrder']}
            label="网络游戏出版物号（ISBN）核发单"
            style={{ flex: 1 }}
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            normalize={uploadEvent2str}
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',
                  g: str2fileList,
                }),
              ]),
            )(
              <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                {!(getFieldValue(['publicationOrder'])?.length >= 1) && (
                  <div>
                    <PlusOutlined style={{ fontSize: '18px' }} />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </CustomUpload>,
            )}
          </Item>
        )}
      </Item>
      <Item dependencies={[['softwareCopyright']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name={['softwareCopyright']}
            label="软著"
            style={{ flex: 1 }}
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            normalize={uploadEvent2str}
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',
                  g: str2fileList,
                }),
              ]),
            )(
              <CustomUpload maxCount={1}>
                {!(getFieldValue(['softwareCopyright'])?.length >= 1) && (
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                )}
              </CustomUpload>,
            )}
          </Item>
        )}
      </Item>

      <Item name={['idAuthFilingCode']} label="实名认证备案识别码">
        <Input placeholder="输入内容" />
      </Item>
    </>
  );
}

function UpdateRecord({ env, value = [] }: { env: ENV; value?: Row['versionList'] }) {
  const client = useQueryClient();

  const classify = useQuery<{ data: { id: number; name: string }[] }>(
    ['game-mgt-classify-list'],
    () => classifyServices('list')({ data: {} }),
    { refetchOnWindowFocus: false },
  );

  const classifyMap = classify?.data?.data?.reduce(
    (acc, cur: any) => acc.set(`${cur.id}`, cur.name),
    new Map(),
  );

  function rollback(row: Record<Extract<keyof Row, 'id' | 'gameNum'>, any>) {
    return () => {
      return Modal.confirm({
        title: '请进行二次确认',
        content: `测试库的游戏将回退到此版本信息（包含apk包+游戏全部信息内容）`,
        onOk: () =>
          services('rollback', { data: row, throwErr: true, notify: true }, env).then(() =>
            client.invalidateQueries(['game-mgt-editor']),
          ),
      });
    };
  }

  interface DiffCol<T> {
    name: Key | Key[];
    label: ReactNode;
    format?: (value?: any, record?: T) => any;
  }

  const columns: DiffCol<Row>[] = [
    { name: 'gameName', label: '游戏名称' },
    { name: 'briefIntroduction', label: '一句话介绍' },
    { name: 'detailedIntroduction', label: '详细介绍' },
    { name: 'gameIcon', label: '游戏Icon', format: (src) => <Image width="60px" src={src} /> },
    {
      name: 'dynamicPicture',
      label: '游戏动态图',
      format: (src) => <Image width="60px" src={src} />,
    },
    {
      name: 'gamePicture',
      label: '游戏截图',
      format: (srcs: string[]) =>
        srcs?.map?.((src: string) => <Image width="60px" src={src} key={src} />),
    },
    {
      name: ['gameVideoList', 0, 'url'],
      label: '游戏视频',
      format: (src: string) => (
        <video width="200px" src={src} controls>
          你的浏览器不支持此视频 <a href={src}>视频链接</a>
        </video>
      ),
    },
    {
      name: ['gameVideoList', 0, 'img'],
      label: '视频封面图',
      format: (src: string) => <Image width="60px" src={src} />,
    },
    { name: 'score', label: '游戏评分' },
    { name: 'thirdGameClassify', label: '第三方游戏分类' },
    {
      name: 'gameClassifyId',
      label: 'APP中游戏分类',
      format: (strs) =>
        str2arr(strs)
          ?.map((str: string) => classifyMap?.get(str) ?? '未知')
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
      format: (v: number) => INSTALL_TYPE.get(v) ?? '未知',
    },
  ];

  function itemRender(row: Record<keyof Row, ReactNode>) {
    return (
      <>
        {columns?.reduce((acc: ReactNode[], { name, label }, idx) => {
          const v = getIn(row, name);
          return v
            ? acc.concat(
                <DItem key={idx} label={label}>
                  {v}
                </DItem>,
              )
            : acc;
        }, [])}
      </>
    );
  }

  function rowRender(row: Record<keyof Row, ReactNode | any>, idx: number) {
    const { operator, ctime, id, gameNum } = row ?? {};
    return (
      <TItem key={idx}>
        <Space direction="vertical">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong>
              {ctime} {operator ?? '系统'} 进行了同步
            </Text>
            {env === 'test' && (
              // && idx !== 0
              <Button
                size="small"
                style={{ color: primaryColor, borderColor: primaryColor }}
                onClick={rollback({ id, gameNum })}
              >
                回退到此版本
              </Button>
            )}
          </div>
          <Descriptions
            column={1}
            size="small"
            labelStyle={{ minWidth: '80px' }}
            style={{ backgroundColor: '#fafafa', padding: '12px' }}
          >
            <DItem>
              <Tag color="success">更新内容</Tag>
            </DItem>
            {itemRender(row)}
          </Descriptions>
        </Space>
      </TItem>
    );
  }

  // 以guest为主，保留master不同的
  function diff(master: Row, guest: Row): Record<any, ReactNode> {
    return columns.reduce((acc, { name, format }, idx) => {
      const [pre, next] = [getIn(master, name), getIn(guest, name)];
      let dom: ReactNode;
      // 相同显示
      if (`${pre}` !== `${next}`) {
        if ((pre ?? true) === true) {
          // delete
          dom = (
            <Text delete key={idx}>
              {format ? format(next, guest) : next}
            </Text>
          );
        } else {
          // update
          dom = <Fragment key={idx}>{format ? format(pre, master) : pre}</Fragment>;
        }

        setTo(acc, name, dom);
      }
      return acc;
    }, {});
  }

  function diffRender() {
    const sort = [...value];
    // .reverse();
    const child: ReactNode[] = [];

    for (let i = 0; i < sort?.length; i++) {
      const [young, old] = [sort[i], sort[i + 1]];
      child.push(
        rowRender(
          {
            ...diff(young, old),
            operator: young?.operator,
            ctime: young?.ctime,
            gameNum: young?.gameNum,
            id: young?.id,
          } as any,
          i,
        ),
      );
    }

    return child;
  }

  return <Timeline>{diffRender()}</Timeline>;
}
