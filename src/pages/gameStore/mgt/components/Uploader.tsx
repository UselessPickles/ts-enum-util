import type { FormItemProps } from 'antd';
import { Form, message, Button, Upload, Card, Space, Divider } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { add } from '../services';
import CustomUpload, { getQiniuKey } from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';

import { UploadOutlined, DeleteOutlined, StarOutlined, PaperClipOutlined } from '@ant-design/icons';
import RESTful from '@/utils/RESTful';

const { Item } = Form;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const file2str = (value: any) => {
    const res = value?.fileList?.[0]?.response;
    return res ? [res] : value;
  };

  const str2file = (value: any) => [].concat(value ?? []);

  const getValueFromEvent: FormItemProps['getValueFromEvent'] = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const normalize: FormItemProps['normalize'] = (value) => value?.[0];

  async function onSubmit() {
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      const value = await form?.validateFields();

      await add({
        data: value,
        throwErr: true,
      });

      onSuccess?.();
    } catch (e: any) {
      if (e?.message) {
        message.error(e?.message);
      }
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, initialValues: { tab: '商务信息' }, ...formProps }}
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
          accept="image/*"
          customRequest={async ({ onSuccess: onUploadSuccess, onError, file }) => {
            const tokenKey = getQiniuKey(file as any);

            try {
              const data = await RESTful.get('', {
                fullUrl: `/intelligent-manager/api/material/getQiniuToken?fileNameList=${tokenKey}`,
                throwErr: true,
              }).then((res) => res?.data);

              if (!data) {
                throw new Error('上传失败');
              }

              const fd = new FormData();
              fd.append('file', file);
              fd.append('token', data?.[tokenKey]);
              fd.append('key', tokenKey);

              await fetch('https://upload.qiniup.com', {
                method: 'POST',
                body: fd,
              });

              const xhr = new XMLHttpRequest();
              if ((Math.random() * 100) % 2) {
                onUploadSuccess?.(`https://image.quzhuanxiang.com/${tokenKey}`, xhr);
              } else {
                onError?.(new Error('error'));
              }
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
              <Card style={{ marginTop: '4px' }} size="small">
                {origin}
                <Divider style={{ margin: '12px 0', backgroundColor: '#f0f0f0' }} />
                <div>信息1: 信息2</div>
                <div>信息1: 信息2</div>
                <div>信息1: 信息2</div>
              </Card>
            );
          }}
        >
          <Button icon={<UploadOutlined />}>上传apk文件</Button>
        </Upload>
      </Item>
      <Item
        name="游戏icon"
        label="游戏icon"
        rules={[{ required: true }]}
        valuePropName="fileList"
        getValueFromEvent={getValueFromEvent}
        normalize={normalize}
      >
        {compose<ReturnType<typeof CustomUpload>>(
          IOC([
            Format({
              valuePropName: 'fileList',
              f: file2str,
              g: str2file,
            }),
          ]),
        )(
          <CustomUpload maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>上传apk文件</Button>
          </CustomUpload>,
        )}
      </Item>
    </ModalForm>
  );
};
