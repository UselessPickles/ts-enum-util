import { Form, message, Input, Modal, Radio } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { compose } from '@/decorators/utils';
import Render from '@/decorators/Common/Render';
import Options from '@/utils/Options';
import { IOC } from '@/decorators/hoc';
import { positiveInteger } from '../utils';

const { Item } = Form;

export default ({
  formProps,
  drawerProps,
  setDrawerProps,
  onSuccess,
  form,
  data = {},
}: ReturnType<typeof useDrawerForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const { id } = data;
  const detail = useQuery(['game-mgt-editor', data.id], () => services.get({ data: { id } }), {
    enabled: !!id,
    refetchOnWindowFocus: false,

    onSuccess(res) {
      const formData = prune(res?.data, isValidValue) ?? {};
      form.setFieldsValue({ ...formData });
    },
  });

  const BtnMap = new Map([
    [1, '开启'],
    [0, '关闭'],
  ]);

  enum BtnEnum {
    '关闭',
    '开启',
  }

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      console.log('value', value);
      const format = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定保存游戏内容吗？再次确定保存成功',
        onOk: async () => {
          try {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
            await services.update({
              // 拼给后端
              data: { ...detail?.data?.data, ...format, versionList: undefined },
              throwErr: true,
            });
            await onSuccess?.();
            setDrawerProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            if (e?.message) {
              message.error(e?.message);
            }
            throw e;
          } finally {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: false }));
          }
        },
      });
    } catch (e: any) {}
  }

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        onFinish: onSubmit,
        validateMessages: {
          required: '该项不能为空',
        },
        initialValues: {
          '单人单日获得金币上限数量-status': BtnEnum.关闭,
          '单人单日获得金币总上限次数-status': BtnEnum.关闭,
          '用户提现金额占广告行为LTV收益的比例-status': BtnEnum.关闭,
          '单人单日总提现上限次数-status': BtnEnum.关闭,
        },
      }}
      drawerProps={{
        ...drawerProps,
        onOk: onSubmit,
        title: '金币规则配置',
      }}
    >
      <Item name={'id'} hidden>
        <Input />
      </Item>
      <Item name={'单人单日获得金币上限数量-status'} label="单人单日获得金币上限数量" required>
        {compose<any>(
          IOC([
            Render((origin) => (
              <div style={{ display: 'flex', width: '100%', gap: 8 }}>
                <Item style={{ marginBottom: 0 }}>{origin}</Item>
                <Item dependencies={[['单人单日获得金币上限数量-status']]} noStyle>
                  {({ getFieldValue }) => {
                    return (
                      getFieldValue(['单人单日获得金币上限数量-status']) === BtnEnum.开启 && (
                        <Item
                          name={'单人单日获得金币上限数量'}
                          rules={[
                            { required: true },
                            { pattern: positiveInteger, message: '仅允许正整数' },
                          ]}
                          style={{ marginBottom: 0, flex: 1 }}
                        >
                          <Input addonAfter="个" />
                        </Item>
                      )
                    );
                  }}
                </Item>
              </div>
            )),
          ]),
        )(<Radio.Group optionType="button" options={Options(BtnMap).toOpt} />)}
      </Item>

      <Item name={'单人单日获得金币总上限次数-status'} label="单人单日获得金币总上限次数" required>
        {compose<any>(
          IOC([
            Render((origin) => (
              <div style={{ display: 'flex', width: '100%', gap: 8 }}>
                <Item style={{ marginBottom: 0 }}>{origin}</Item>
                <Item dependencies={[['单人单日获得金币总上限次数-status']]} noStyle>
                  {({ getFieldValue }) =>
                    getFieldValue(['单人单日获得金币总上限次数-status']) === BtnEnum.开启 && (
                      <Item
                        name={'单人单日获得金币总上限次数'}
                        rules={[
                          { required: true },
                          { pattern: positiveInteger, message: '仅允许正整数' },
                        ]}
                        style={{ marginBottom: 0, flex: 1 }}
                      >
                        <Input addonAfter="次" />
                      </Item>
                    )
                  }
                </Item>
              </div>
            )),
          ]),
        )(<Radio.Group optionType="button" options={Options(BtnMap).toOpt} />)}
      </Item>

      <Item
        name={'用户提现金额占广告行为LTV收益的比例-status'}
        label="用户提现金额占广告行为LTV收益的比例"
        tooltip="用户每次提现，对用户提现金额与用广告行为与LTV收益进行对比，提现金额对比收益小于等于设置的范围，用户可提现，大于用户无法提现"
        required
      >
        {compose<any>(
          IOC([
            Render((origin) => (
              <div style={{ display: 'flex', width: '100%', gap: 8 }}>
                <Item style={{ marginBottom: 0 }}>{origin}</Item>
                <Item dependencies={[['用户提现金额占广告行为LTV收益的比例-status']]} noStyle>
                  {({ getFieldValue }) =>
                    getFieldValue(['用户提现金额占广告行为LTV收益的比例-status']) ===
                      BtnEnum.开启 && (
                      <Item
                        name={'用户提现金额占广告行为LTV收益的比例'}
                        rules={[
                          { required: true },
                          { pattern: positiveInteger, message: '仅允许正整数' },
                        ]}
                        style={{ marginBottom: 0, flex: 1 }}
                      >
                        <Input addonBefore="<=" addonAfter="%" />
                      </Item>
                    )
                  }
                </Item>
              </div>
            )),
          ]),
        )(<Radio.Group optionType="button" options={Options(BtnMap).toOpt} />)}
      </Item>

      <Item name={'单人单日总提现上限次数-status'} label="单人单日总提现上限次数" required>
        {compose<any>(
          IOC([
            Render((origin) => (
              <div style={{ display: 'flex', width: '100%', gap: 8 }}>
                <Item style={{ marginBottom: 0 }}>{origin}</Item>
                <Item dependencies={[['单人单日总提现上限次数-status']]} noStyle>
                  {({ getFieldValue }) =>
                    getFieldValue(['单人单日总提现上限次数-status']) === BtnEnum.开启 && (
                      <Item
                        name={'单人单日总提现上限次数'}
                        rules={[
                          { required: true },
                          { pattern: positiveInteger, message: '仅允许正整数' },
                        ]}
                        style={{ marginBottom: 0, flex: 1 }}
                      >
                        <Input addonAfter="次" />
                      </Item>
                    )
                  }
                </Item>
              </div>
            )),
          ]),
        )(<Radio.Group optionType="button" options={Options(BtnMap).toOpt} />)}
      </Item>
    </DrawerForm>
  );
};
