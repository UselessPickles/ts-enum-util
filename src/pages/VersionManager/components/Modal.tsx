import { Button, Form, Input, Radio, Upload } from 'antd';
import ModalForm from '@/components/ModalForm';
import { useContainer, useModalFromSubmit } from '../useStore';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Item } = Form,
  { TextArea } = Input;

export default () => {
  const { modalFormRef, modalProps, setModalProps } = useContainer(),
    { submitor } = useModalFromSubmit();
  const [warning, setWarning] = useState<string>();

  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <ModalForm
      formProps={{
        form: modalFormRef,
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        onFinish: submitor,
        initialValues: { updateWay: 0 },
      }}
      modalProps={{ ...modalProps, onOk: submitor, onCancel: onCancel, okText: '发布' }}
    >
      <Item
        label="上传安装包"
        name="uploadApk"
        rules={[{ required: true }]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          accept=".apk,.aab"
          maxCount={1}
          itemRender={(origin) => {
            return <div style={{ background: '#F4F5F6' }}>{origin}</div>;
          }}
        >
          <Button icon={<UploadOutlined />}>上传apk</Button>
        </Upload>
      </Item>
      <Item label="版本号" required={true}>
        <>
          <Item
            style={{ marginBottom: 0 }}
            name="version"
            rules={[
              { required: true, message: '版本号是必填选项' },
              ({}) => {
                return {
                  warningOnly: true,
                  validator(_, version) {
                    const reg = /[^\d^\.]+/g;
                    if (reg.test(version)) {
                      return Promise.reject('输入格式错误,只能输入数字和小数点');
                    }
                    if (version == '1111') {
                      //return Promise.reject('版本号重复')
                      setWarning('版本号重复');
                    } else {
                      setWarning(undefined);
                    }
                    return Promise.resolve();
                  },
                };
              },
            ]}
          >
            <Input />
          </Item>
          {warning && <div style={{ color: '#ff4d4f' }}>{warning}</div>}
        </>
      </Item>
      <Item label="更新方式" name="updateWay" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { label: '非强制更新', value: 0 },
            { label: '强制更新', value: 1 },
          ]}
        />
      </Item>
      <Item label="更新内容" name="updateContent">
        <TextArea showCount maxLength={100} autoSize={{ minRows: 3, maxRows: 8 }} />
      </Item>
    </ModalForm>
  );
};
