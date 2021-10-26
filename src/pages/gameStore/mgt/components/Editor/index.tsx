import type { FormItemProps, DatePickerProps } from 'antd';
import {
  Form,
  message,
  Radio,
  Input,
  Image,
  Space,
  Button,
  DatePicker,
  Checkbox,
  Descriptions,
  Popconfirm,
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
import { add } from '../../services';
import Options from '@/utils/Options';
import { PROFIT_MODE, INSTALL_TYPE, STATUS, TYPE } from '../../models';
import SearchSelect from '@/components/SearchSelect';
import FormItemView from '@/components/FormItemView';
import CustomUpload, { getExt } from '@/components/CustomUpload';
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
} from '@/decorators/Upload/Format';
import type { Moment } from 'moment';
import moment from 'moment';
import theme from '@/../config/theme';
const { 'primary-color': primaryColor } = theme;

const { Item } = Form;
const { TabPane } = Tabs;
const { Text } = Typography;
const { Item: DItem } = Descriptions;
const { Item: TItem } = Timeline;

const getValueFromEvent: FormItemProps['getValueFromEvent'] = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  async function onSubmit() {
    const value = await form?.validateFields();

    Modal.confirm({
      title: '请进行二次确认',
      content: '上传的游戏将进入自动化测试，测试完成可同步到线上',
      onOk: async () => {
        try {
          setModalProps((pre) => ({ ...pre, confirmLoading: true }));
          await add({
            data: value,
            throwErr: true,
          });
          onSuccess?.();
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
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        initialValues: {
          tab: '游戏资料',
          游戏视频: 'https://image.quzhuanxiang.com/566game/rc-upload-1634886125444-13.webm',
          安装方式: '内部安装',
        },
        className: styles['form-item-margin-bottom'],

        ...formProps,
      }}
      modalProps={{
        onOk: onSubmit,
        className: styles['modal-title-height'],
        visible: true,
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
              <Item noStyle hidden={t !== '游戏资料'}>
                <GameInfo />
              </Item>
              <Item noStyle hidden={t !== '资源信息'}>
                <SourceInfo />
              </Item>
              <Item noStyle hidden={t !== '商务信息'}>
                <BizInfo />
              </Item>
              <Item noStyle hidden={t !== '更新记录'}>
                <UpdateRecord />
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
      <Item name="游戏名称" label="游戏名称" rules={[{ required: true }]}>
        <Input placeholder="输入内容" />
      </Item>
      <Item name="一句话介绍" label="一句话介绍" rules={[{ required: true }]}>
        <Input placeholder="输入内容" />
      </Item>
      <Item name="详细介绍" label="详细介绍" rules={[{ required: true }]}>
        <Input.TextArea placeholder="输入内容" rows={5} />
      </Item>
      <div style={{ display: 'flex' }}>
        <Item dependencies={[['游戏Icon']]} noStyle>
          {({ getFieldValue }) => (
            <Item
              name="游戏Icon"
              label="游戏Icon"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
              valuePropName="fileList"
            >
              {compose<ReturnType<typeof CustomUpload>>(
                IOC([
                  Format({
                    valuePropName: 'fileList',
                    f: uploadEvent2str,
                    g: str2fileList,
                  }),
                ]),
              )(
                <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                  {!(getFieldValue(['游戏Icon'])?.length >= 1) && (
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

        <Item dependencies={[['头图']]} noStyle>
          {({ getFieldValue }) => (
            <Item
              name="头图"
              label="头图"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
              valuePropName="fileList"
            >
              {compose<ReturnType<typeof CustomUpload>>(
                IOC([
                  Format({
                    valuePropName: 'fileList',
                    f: uploadEvent2str,
                    g: str2fileList,
                  }),
                ]),
              )(
                <CustomUpload maxCount={1} accept=".jpg,.png" listType="picture-card">
                  {!(getFieldValue(['头图'])?.length >= 1) && (
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
      <Item dependencies={[['游戏截图']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name="游戏截图"
            label="游戏截图"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
            valuePropName="fileList"
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',
                  f: uploadEvent2strArr,
                  g: strArr2fileList,
                }),
              ]),
            )(
              <CustomUpload maxCount={5} accept=".jpg,.png" listType="picture-card" multiple>
                {!(getFieldValue(['游戏截图'])?.length >= 5) && (
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
        <Item dependencies={[['游戏视频']]} noStyle>
          {({ getFieldValue }) => {
            const url = getFieldValue(['游戏视频'])?.[0]?.response || getFieldValue(['游戏视频']);
            return (
              <Item name="游戏视频" label="游戏视频" style={{ flex: 1 }} valuePropName="fileList">
                {compose<ReturnType<typeof CustomUpload>>(
                  IOC([
                    Format({
                      valuePropName: 'fileList',
                      f: uploadEvent2str,
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

        <Item dependencies={[['游戏动态图']]} noStyle>
          {({ getFieldValue }) => (
            <Item name="游戏动态图" label="游戏动态图" style={{ flex: 1 }} valuePropName="fileList">
              {compose<ReturnType<typeof CustomUpload>>(
                IOC([
                  Format({
                    valuePropName: 'fileList',
                    f: uploadEvent2str,
                    g: str2fileList,
                  }),
                ]),
              )(
                <CustomUpload maxCount={1} accept=".gif" listType="picture-card">
                  {!(getFieldValue(['游戏动态图'])?.length >= 1) && (
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

      <Item name="游戏评分" label="游戏评分">
        <InputNumber placeholder="输入内容" min={0} max={10} style={{ width: '100%' }} />
      </Item>

      <Item>
        <Text strong>2. 基础信息</Text>
      </Item>
      <Item name="第三方游戏分类" label="第三方游戏分类">
        <SearchSelect mode="multiple" showArrow />
      </Item>
      <Item name="APP中游戏分类" label="APP中游戏分类" rules={[{ required: true }]}>
        <SearchSelect mode="multiple" showArrow />
      </Item>
    </>
  );
}

// 资源信息
function SourceInfo() {
  return (
    <>
      <Item
        name={['resources', 'apk']}
        label="游戏apk"
        valuePropName="fileList"
        getValueFromEvent={getValueFromEvent}
      >
        <Upload
          maxCount={1}
          accept=".apk,.aab"
          customRequest={async ({ onSuccess, onError, file }) => {
            console.log(file);

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
                  <Button icon={<DownloadOutlined />}>下载{getExt(file.name)}文件</Button>
                </div>
                <Divider style={{ margin: '12px 0', backgroundColor: '#fafafa' }} />
                <Descriptions column={1} size="small" labelStyle={{ minWidth: '80px' }}>
                  <DItem label="内部版本号"> 信息2</DItem>
                  <DItem label="外部版本号"> 信息2</DItem>
                  <DItem label="MD5"> 信息2</DItem>
                  <DItem label="游戏位数"> 信息2</DItem>
                </Descriptions>
              </Card>
            );
          }}
        >
          <Button icon={<UploadOutlined />}>上传apk文件</Button>
        </Upload>
      </Item>
      <Item name={['resources', 'installType']} label="安装方式" rules={[{ required: true }]}>
        <Radio.Group options={Options(INSTALL_TYPE).toOpt} optionType="button" />
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
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',
                  f: uploadEvent2str,
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
          >
            {compose<ReturnType<typeof CustomUpload>>(
              IOC([
                Format({
                  valuePropName: 'fileList',
                  f: uploadEvent2str,
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

function UpdateRecord() {
  return (
    <Timeline>
      {Array(20)
        .fill(Object.create(null))
        .map((_, key) => (
          <TItem key={key}>
            <Space direction="vertical">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>2. 基础信息</Text>
                <Popconfirm title="二次确认">
                  <Button size="small" style={{ color: primaryColor, borderColor: primaryColor }}>
                    回退到此版本
                  </Button>
                </Popconfirm>
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
