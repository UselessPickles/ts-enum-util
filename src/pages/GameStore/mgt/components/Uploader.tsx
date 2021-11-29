import { useRef } from 'react';
import type { InputProps, UploadProps } from 'antd';
import { Form, message, Button, Upload, Card, Divider, Input, Modal } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { services } from '../services';
import CustomUpload from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';

import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import showCount from '@/decorators/Input/ShowCount';
import type { ReactElement } from 'react';

import FormItemView from '@/components/FormItemView';
import { extra } from './utils';
import { beforeUpload as beforeApkUpload, fileUploadChecked } from './utils';
import { getValueFromEvent, str2fileList, uploadEvent2str } from '@/decorators/Format/converter';
const { Item } = Form;
import OSS from 'ali-oss';
import RESTful from '@/utils/RESTful';

export default ({
  data,
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const client = useRef<OSS>();

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const outOfRange = file.size / 1024 > 200;
    if (outOfRange) {
      message.warning('图片必须小于200k');
      return Upload.LIST_IGNORE;
    }
    return !outOfRange;
  };

  async function onSubmit() {
    const value = await form?.validateFields();

    Modal.confirm({
      title: '请进行二次确认',
      content: '上传的游戏将进入自动化测试，测试完成可同步到线上',
      onOk: async () => {
        try {
          setModalProps((pre) => ({ ...pre, confirmLoading: true }));
          await services.save(
            {
              data: value,
              throwErr: true,
            },
            data.env,
          );
          await onSuccess?.();
          setModalProps((pre) => ({ ...pre, visible: false }));
          form.resetFields();
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
  function afterClose() {
    client?.current?.cancel?.();
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,
        ...formProps,
      }}
      modalProps={{
        onOk: onSubmit,
        ...modalProps,
        afterClose,
      }}
    >
      <Item noStyle dependencies={[['apk']]}>
        {({ setFieldsValue }) => (
          <Item
            name={['apk']}
            label="游戏apk"
            rules={[{ required: true }, ...fileUploadChecked]}
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
                maxCount={1}
                accept=".apk,.aab"
                beforeUpload={beforeApkUpload}
                customRequest={async ({
                  onSuccess: onUploadSuccess,
                  onError,
                  onProgress,
                  file,
                }) => {
                  const apkSize = (file as any)?.size;

                  try {
                    const credentials =
                      (await RESTful.post('fxx/game/credentials', {
                        method: 'POST',
                        throwErr: true,
                        notify: false,
                      }).then((res) => res?.data)) ?? {};

                    if (!credentials) {
                      const e = new Error('授权失败');
                      onError?.(e);
                      throw e;
                    }

                    const { domain } = credentials;

                    const f: any = file;
                    client.current = new OSS({
                      ...credentials,
                      endpoint: 'oss-cn-shanghai.aliyuncs.com',
                      stsToken: credentials?.securityToken,
                      // 不超时
                      timeout: 60 * 60 * 1000,
                      // 不刷新token
                      refreshSTSTokenInterval: 60 * 60 * 1000,
                    });
                    const path = `${PROCESS_ENV.APP_NAME}/${PROCESS_ENV.NODE_ENV}/${f?.uid}-${f?.name}`;

                    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
                    // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
                    const res = await client?.current?.multipartUpload(path, file, {
                      progress: function (p) {
                        // checkpoint参数用于记录上传进度，断点续传上传时将记录的checkpoint参数传入即可。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
                        onProgress?.({ percent: p * 100 } as any);
                      },
                      // parallel: 4,
                      // 设置分片大小。默认值为1 MB，最小值为100 KB。
                      // partSize: 1024 * 1024,
                      // mime: 'text/plain',
                    });

                    if (res?.res?.status !== 200) {
                      const e = new Error('上传失败');
                      onError?.(e);
                      throw e;
                    }

                    const xhr = new XMLHttpRequest();
                    const uri = `${domain}${path}`;

                    const parse = await RESTful.post('fxx/game/test/apk/parser', {
                      data: { apk: uri },
                      throwErr: true,
                      notify: false,
                    });

                    const apkRes = parse?.data ?? {};
                    const { gameName, ...restApkRes } = apkRes;

                    setFieldsValue({ apkSize, gameNameView: gameName, ...restApkRes });

                    // const { packageName, insideVersion, } = apkRes;
                    // if (packageName && packageName !== getFieldValue(['packageName'])) {
                    //   throw new Error('包名不一致');
                    // }

                    // if (insideVersion && +insideVersion <= getFieldValue(['insideVersion'])) {
                    //   throw new Error('此游戏已存在且非新版本，无法上传');
                    // }

                    onUploadSuccess!(uri, xhr);
                  } catch (e: any) {
                    console.error(e);
                  }
                }}
                showUploadList={{
                  showDownloadIcon: true,
                  downloadIcon: 'download ',
                  showRemoveIcon: true,
                }}
                itemRender={(origin) => {
                  return (
                    <Card style={{ marginTop: '4px', backgroundColor: '#fafafa' }} size="small">
                      {origin}
                      <Divider style={{ margin: '12px 0', backgroundColor: '#fafafa' }} />
                      <Item name={['gameNameView']} label="游戏名称:" {...extra}>
                        <FormItemView />
                      </Item>
                      <Item name={['packageName']} label="包名:" {...extra}>
                        <FormItemView />
                      </Item>
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

                      <Item name={['apkSize']} label="apkSize" hidden>
                        <Input disabled />
                      </Item>
                    </Card>
                  );
                }}
              >
                <Button icon={<UploadOutlined />}>上传apk文件</Button>
              </Upload>,
            )}
          </Item>
        )}
      </Item>

      <Item name="gameName" label="游戏名称" rules={[{ required: true }]}>
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={20} />)}
      </Item>
      <Item dependencies={[['gameIcon']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name="gameIcon"
            label="游戏Icon"
            rules={[{ required: true }, ...fileUploadChecked]}
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            normalize={uploadEvent2str}
            extra="jpg、png格式，建议尺寸492*492 px，不超过200k"
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
                accept=".jpg,.png"
                listType="picture-card"
                beforeUpload={beforeUpload}
              >
                {!(getFieldValue(['gameIcon'])?.length >= 1) && (
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
    </ModalForm>
  );
};
