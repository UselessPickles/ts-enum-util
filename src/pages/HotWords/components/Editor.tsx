import type { InputProps, UploadProps } from 'antd';
import { Form, message, Upload, Input, Modal } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';

import CustomUpload from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';
import { services } from '../services';

import { PlusOutlined } from '@ant-design/icons';
import showCount from '@/decorators/Input/ShowCount';
import type { ReactElement } from 'react';

import { getValueFromEvent, str2fileList, uploadEvent2str } from '@/decorators/Format/converter';
const { Item } = Form;

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
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const outOfRange = file.size / 1024 > 100;
    if (outOfRange) {
      message.warning('图片必须小于100k');
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
          await services(
            'save',
            {
              data: value,
              throwErr: true,
            },
            data.env,
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
  }

  return (
    <ModalForm
      formProps={{
        onFinish: onSubmit,

        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name={['insideVersion']} label="内部版本号" rules={[{ required: true }]}>
        <Input />
      </Item>

      <Item name={['packageName']} label="包名" rules={[{ required: true }]}>
        <Input />
      </Item>

      <Item name="gameName" label="游戏名称" rules={[{ required: true }]}>
        {compose<ReactElement<InputProps>>(IOC([showCount]))(<Input maxLength={20} />)}
      </Item>
      <Item dependencies={[['gameIcon']]} noStyle>
        {({ getFieldValue }) => (
          <Item
            name="gameIcon"
            label="游戏Icon"
            rules={[{ required: true }]}
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            normalize={uploadEvent2str}
            extra="jpg、png格式，建议尺寸xx*xx px，不超过100k"
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
