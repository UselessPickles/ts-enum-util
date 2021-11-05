import { Button, Form, Input, Radio, Upload } from 'antd';
import ModalForm from '@/components/ModalForm';
import { useContainer, useModalFromSubmit } from '../useStore';
import { UploadOutlined } from '@ant-design/icons';
import { check } from '../serivces';
import CustomUpload from '@/components/CustomUpload';
import { getValueFromEvent, str2fileList, uploadEvent2str } from '@/decorators/Upload/Format';
import { compose } from '@/decorators/utils';
import { IOC } from '@/decorators/hoc';
import Format from '@/decorators/Format';

const { Item } = Form,
  { TextArea } = Input;

export default () => {
  const { modalFormRef, modalProps, setModalProps, warning, setWarning } = useContainer(),
    { submitor } = useModalFromSubmit();

  function onCancel() {
    setModalProps({
      visible: false,
    });
    modalFormRef.resetFields();
    setWarning(undefined);
  }

  return (
    <ModalForm
      formProps={{
        form: modalFormRef,
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        onFinish: submitor,
        initialValues: { updateType: 2 },
      }}
      modalProps={{ ...modalProps, onOk: submitor, onCancel: onCancel, okText: '发布' }}
    >
      <Item
        label="上传安装包"
        name="apkUrl"
        rules={[{ required: true }]}
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
            accept=".apk,.aab"
            maxCount={1}
            itemRender={(origin) => {
              return <div style={{ background: '#F4F5F6' }}>{origin}</div>;
            }}
          >
            <Button icon={<UploadOutlined />}>上传apk</Button>
          </CustomUpload>,
        )}
      </Item>
      <Item label="版本号" required={true}>
        <>
          <Item
            style={{ marginBottom: 0 }}
            name="appVersionCode"
            rules={[
              { required: true, message: '版本号是必填选项' },
              ({}) => {
                return {
                  warningOnly: true,
                  async validator(_, appVersionCode) {
                    const reg = /[^\d^\.]+/g;
                    if (reg.test(appVersionCode)) {
                      return Promise.reject('输入格式错误,只能输入数字和小数点');
                    }
                    const result = await check({
                      data: {
                        appVersion: appVersionCode.replace(/(^0.|\.)/g, ''),
                      },
                      throwErr: true,
                      notify: false,
                    }).then((res) => res?.result);
                    console.log('result', result);
                    setWarning(result?.status === 0 ? result?.msg : undefined);
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
      <Item label="更新方式" name="updateType" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { label: '非强制更新', value: 2 },
            { label: '强制更新', value: 1 },
          ]}
        />
      </Item>
      <Item label="更新内容" name="content">
        <TextArea showCount maxLength={100} autoSize={{ minRows: 3, maxRows: 8 }} />
      </Item>
    </ModalForm>
  );
};
