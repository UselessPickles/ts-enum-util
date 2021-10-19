import { Form, message, Radio, Input, Image, Space, Button, DatePicker, Checkbox } from 'antd';

import ModalForm from '@/components/ModalForm';
import type useModalForm from '@/hooks/useModalForm';
import { add } from '../services';
import Options from '@/utils/Options';
import { GAIN_TYPE, TYPE } from '../models';
import SearchSelect from '@/components/SearchSelect';
import FormItemView from '@/components/FormItemView';
import CustomUpload from '@/components/CustomUpload';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { compose } from '@/decorators/utils';
import { PlusOutlined } from '@ant-design/icons';

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
      modalProps={{ onOk: onSubmit, visible: true, ...modalProps }}
    >
      <Item name="tab" wrapperCol={{ span: 24 }}>
        <Radio.Group optionType="button" options={Options(TYPE).toOpt} />
      </Item>

      <Item dependencies={[['tab']]} noStyle>
        {({ getFieldValue }) => {
          switch (getFieldValue(['tab'])) {
            case '游戏资料':
              return <GameInfo />;
            case '资源信息':
              return <SourceInfo />;
            case '商务信息':
              return <BizInfo />;
            case '更新记录':
              return <UpdateRecord />;
            default:
              break;
          }
        }}
      </Item>
    </ModalForm>
  );
};

// 游戏资料
function GameInfo() {
  return (
    <>
      <Item name="游戏名" label="游戏名">
        <Input placeholder="输入内容" />
      </Item>
      <Item name="一句话介绍" label="一句话介绍">
        <Input placeholder="输入内容" />
      </Item>
      <Item name="详细介绍" label="详细介绍">
        <Input.TextArea placeholder="输入内容" />
      </Item>
      <div style={{ display: 'flex' }}>
        <Item name="icon" label="icon" labelCol={{ span: 14 }} style={{ flex: 1 }}>
          <Image src="error" width="100%" />
        </Item>
        <Item name="头图" label="头图" labelCol={{ span: 14 }} style={{ flex: 1 }}>
          <Image src="error" width="100%" />
        </Item>
      </div>
      <Item name="游戏截图" label="游戏截图">
        <Space style={{ width: '100%' }}>
          <Image src="error" width="100%" />
          <Image src="error" width="100%" />
          <Image src="error" width="100%" />
          <Image src="error" width="100%" />
        </Space>
      </Item>
      <Item name="游戏分类（第三方）" label="游戏分类（第三方）">
        <SearchSelect mode="multiple" showArrow />
      </Item>
      <Item name="游戏分类" label="游戏分类">
        <SearchSelect mode="multiple" showArrow />
      </Item>
    </>
  );
}

// 资源信息
function SourceInfo() {
  const file2str = (value: any) => {
    const res = value?.fileList?.[0]?.response;
    return res ? [res] : value;
  };

  const str2file = (value: any) => [].concat(value ?? {});

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Item
        name="apk"
        label="apk"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        normalize={(value) => value?.[0]}
        extra={<Button onClick={() => {}}>下载apk</Button>}
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
          <CustomUpload
            showUploadList={false}
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            action={`${PROCESS_ENV.NODE_ENV}/pay`}
          >
            <PlusOutlined />
          </CustomUpload>,
        )}
      </Item>
      <Item label="内部版本号" name="内部版本号">
        <FormItemView />
      </Item>
      <Item label="外部版本号" name="外部版本号">
        <FormItemView />
      </Item>
      <Item label="MD5" name="MD5">
        <FormItemView />
      </Item>
      <Item name="安装方式" label="安装方式">
        <SearchSelect mode="multiple" showArrow />
      </Item>
    </>
  );
}

// 商务信息
function BizInfo() {
  return (
    <>
      <Item name="更新方式" label="更新方式">
        <SearchSelect />
      </Item>
      <Item name="定时更新" label="定时更新">
        <DatePicker showTime />
      </Item>

      <Item name="盈利方式" label="盈利方式">
        <Checkbox.Group options={Options(GAIN_TYPE).toOpt} />
      </Item>

      <Item name="更新内容" label="更新内容">
        <Input.TextArea placeholder="输入内容" />
      </Item>
      <Item name="出版物号（ISBN号）" label="出版物号（ISBN号）">
        <Input placeholder="输入内容" />
      </Item>

      <Item
        name="网络游戏出版物号（ISBN）核发单"
        label="网络游戏出版物号（ISBN）核发单"
        labelCol={{
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'visible',
          },
          span: 7,
        }}
      >
        <Image src="error" width="100%" />
      </Item>
      <Item name="软著" label="软著">
        <Image src="error" width="100%" />
      </Item>

      <Item name="实名认证备案识别码" label="实名认证备案识别码">
        <Input placeholder="输入内容" />
      </Item>
    </>
  );
}

function UpdateRecord() {
  return <></>;
}
