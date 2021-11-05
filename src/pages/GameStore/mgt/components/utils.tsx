import { Modal, Upload } from 'antd';
import type { FormItemProps, UploadProps } from 'antd';

export const extra: FormItemProps = {
  labelCol: { span: 4, style: { paddingBottom: 0 } },
  style: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
};

export const beforeUpload: UploadProps['beforeUpload'] = () => {
  return new Promise((res) => {
    Modal.confirm({
      title: '请进行二次确认',
      content: `上传的游戏将进入自动化测试，测试完成可同步到线上`,
      onOk: () => res(),
      onCancel: () => res(Upload.LIST_IGNORE),
    });
  });
};

export const fileUploadChecked: Exclude<FormItemProps['rules'], undefined> = [
  {
    validator(_, value) {
      if (value?.some?.((v: any) => v?.status === 'error')) {
        return Promise.reject(value?.[0]?.error);
      }
      return Promise.resolve();
    },
  },
  {
    validator(_, value) {
      if (value?.some?.((v: any) => v?.status === 'uploading')) {
        return Promise.reject(new Error('请耐心等待上传完成'));
      }
      return Promise.resolve();
    },
    validateTrigger: 'onSubmit',
  },
];
