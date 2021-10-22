import type { FormItemProps, InputProps, UploadProps } from 'antd';
import {
  Form,
  message,
  Button,
  Upload,
  Card,
  Space,
  Divider,
  Input,
  Modal,
  Descriptions,
} from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { add } from '../services';
import CustomUpload, { getQiniuKey } from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';

import {
  UploadOutlined,
  DeleteOutlined,
  StarOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import RESTful from '@/utils/RESTful';
import showCount from '@/decorators/Input/showCount';
import type { ReactElement } from 'react';
import {
  str2fileList,
  strArr2fileList,
  uploadEvent2str,
  uploadEvent2strArr,
} from '@/decorators/Upload/Format';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';
import theme from '@/../config/theme';
const { 'primary-color': primaryColor, 'text-color-secondary': textColorSecondary } = theme;
const { Item } = Form;
const { Item: DItem } = Descriptions;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const outOfRange = file.size / 1024 > 100;
    if (outOfRange) {
      message.warning('图片必须小于100k');
      return Upload.LIST_IGNORE;
    }
    return !outOfRange;
  };

  const getValueFromEvent: FormItemProps['getValueFromEvent'] = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item
        name="游戏apk"
        label="游戏apk"
        rules={[{ required: true }]}
        valuePropName="fileList"
        getValueFromEvent={getValueFromEvent}
      >
        <Upload
          maxCount={1}
          accept=".apk,.aab"
          customRequest={async ({ onSuccess: onUploadSuccess, onError, file }) => {
            console.log(file);
            const tokenKey = getQiniuKey(file as any);

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
              onError?.(new Error('error'));
              // if ((Math.random() * 100) % 2) {
              //   onUploadSuccess?.(`https://image.quzhuanxiang.com/${tokenKey}`, xhr);
              // } else {
              //   onError?.(new Error('error'));
              // }
            } catch (e: any) {
              onError?.(e);
            }
          }}
          showUploadList={{
            showDownloadIcon: true,
            downloadIcon: 'download ',
            showRemoveIcon: true,
          }}
          itemRender={(origin, file) => {
            return (
              <Card style={{ marginTop: '4px', backgroundColor: textColorSecondary }} size="small">
                {origin}
                <Divider style={{ margin: '12px 0', backgroundColor: textColorSecondary }} />
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

      <Item name="游戏名称" label="游戏名称" rules={[{ required: true }]}>
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={20} />)}
      </Item>
      <Item dependencies={[['游戏Icon']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name="游戏Icon"
            label="游戏Icon"
            rules={[{ required: true }]}
            valuePropName="fileList"
            extra="jpg、png格式，建议尺寸xx*xx px，不超过100k"
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
              <CustomUpload
                maxCount={1}
                accept=".jpg,.png"
                listType="picture-card"
                beforeUpload={beforeUpload}
              >
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
    </ModalForm>
  );
};
