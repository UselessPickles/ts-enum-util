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
  Timeline,
  Tag,
} from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { services } from '../../services';
import Options from '@/utils/Options';
import type { ENV } from '../../models';
import { PROFIT_MODE, INSTALL_TYPE, STATUS, TYPE } from '../../models';
import SearchSelect from '@/components/SearchSelect';
import FormItemView from '@/components/FormItemView';
import CustomUpload from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  uploadEvent2str,
  str2fileList,
  strArr2fileList,
  uploadEvent2strArr,
  getValueFromEvent,
} from '@/decorators/Upload/Format';
import type { Moment } from 'moment';
import moment from 'moment';
import theme from '@/../config/theme';
import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import SelectAll from '@/decorators/Select/SelectAll';
import { arr2str, str2arr } from '@/decorators/Select/Format';
import { extra } from '../constant';
import getExt from '@/utils/file/getExt';
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
      const format = prune(value, isValidValue);

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
              <Item noStyle hidden={t !== '更新记录'}>
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
        <Item dependencies={[['gameVideoList', 0, 'url']]} noStyle>
          {({ getFieldValue }) => {
            const url =
              getFieldValue(['gameVideoList', 0, 'url'])?.[0]?.response ||
              getFieldValue(['gameVideoList', 0, 'url']);
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
                    showUploadList={false}
                    listType="picture-card"
                  >
                    {url ? (
                      <video src={url} width="100%" height="100%">
                        你的浏览器不支持此视频 <a href={url}>视频链接</a>
                      </video>
                    ) : (
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
        )(<SearchSelect mode="multiple" showArrow />)}
      </Item>
    </>
  );
}

// 资源信息
function SourceInfo({ env }: { env: ENV }) {
  return (
    <>
      <Item
        name={['resources', 'apk']}
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
          <Upload
            disabled={env === 'prod'}
            maxCount={1}
            accept=".apk,.aab"
            customRequest={async ({ onSuccess, onError, file }) => {
              try {
                // const data = await RESTful.get('', {
                //   fullUrl: `/intelligent-manager/api/material/getQiniuToken?fileNameList=${tokenKey}`,
                //   throwErr: true,
                // }).then((res) => res?.data);

                // if (!data) {
                //   throw new Error('上传失败');
                // }

                // const fd = new FormData();
                // fd.append('file', file);
                // fd.append('token', data?.[tokenKey]);
                // fd.append('key', tokenKey);

                // await fetch('https://upload.qiniup.com', {
                //   method: 'POST',
                //   body: fd,
                // });

                const xhr = new XMLHttpRequest();

                if ((Math.random() * 100) % 2) {
                  onSuccess?.(`https://image.quzhuanxiang.com/${123}`, xhr);
                } else {
                  onError?.(new Error('error'));
                }
              } catch (e: any) {
                onError?.(e);
              }
            }}
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

                  <Item name={['resources', 'insideVersion']} label="内部版本号：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['resources', 'externalVersion']} label="外部版本号：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['resources', 'md5']} label="MD5：" {...extra}>
                    <FormItemView />
                  </Item>
                  <Item name={['resources', 'undo']} label="游戏位数：" {...extra}>
                    <FormItemView />
                  </Item>
                </Card>
              );
            }}
          >
            <Button icon={<UploadOutlined />} disabled={env === 'prod'}>
              上传apk文件
            </Button>
          </Upload>,
        )}
      </Item>

      <Item name={['resources', 'installType']} label="安装方式" rules={[{ required: true }]}>
        <Radio.Group
          disabled={env === 'prod'}
          options={Options(INSTALL_TYPE).toOpt}
          optionType="button"
        />
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
        name={['resources', 'timingUpdateTime']}
        label="定时更新"
        rules={[
          {
            validator: (_, time: Moment) => {
              if (time <= moment()) {
                return Promise.reject(new Error('不能小于当前时间'));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <DatePicker showTime disabledDate={disabledDate} disabledTime={disabledTime} />
      </Item>

      <Item name={['business', 'profitMode']} label="盈利方式">
        <Checkbox.Group options={Options(PROFIT_MODE).toOpt} />
      </Item>

      <Item name={['resources', 'updateContent']} label="更新内容">
        <Input.TextArea placeholder="输入内容" />
      </Item>

      <Item name={['business', 'publicationNo']} label="出版物号（ISBN号）">
        <Input placeholder="输入内容" />
      </Item>
      <Item dependencies={[['business', 'publicationOrder']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name={['business', 'publicationOrder']}
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
                {!(getFieldValue(['business', 'publicationOrder'])?.length >= 1) && (
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
      <Item dependencies={[['business', 'softwareCopyright']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name={['business', 'softwareCopyright']}
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
                {!(getFieldValue(['business', 'softwareCopyright'])?.length >= 1) && (
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                )}
              </CustomUpload>,
            )}
          </Item>
        )}
      </Item>

      <Item name={['business', 'idAuthFilingCode']} label="实名认证备案识别码">
        <Input placeholder="输入内容" />
      </Item>
    </>
  );
}

function UpdateRecord({ env }: { env: ENV }) {
  function rollback() {
    return () => {
      return Modal.confirm({
        title: '请进行二次确认',
        content: `测试库的游戏将回退到此版本信息（包含apk包+游戏全部信息内容）`,
        onOk: () => {},
      });
    };
  }
  return (
    <Timeline>
      {Array(20)
        .fill(Object.create(null))
        .map((_, key) => (
          <TItem key={key}>
            <Space direction="vertical">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>2. 基础信息</Text>
                {env === 'test' && (
                  <Button
                    size="small"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                    onClick={rollback()}
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
                <DItem label="内部版本号"> 信息2</DItem>
                <DItem label="外部版本号"> 信息2</DItem>
                <DItem label="MD5"> 信息2</DItem>
                <DItem label="游戏位数"> 信息2</DItem>
              </Descriptions>
            </Space>
          </TItem>
        ))}
    </Timeline>
  );
}
