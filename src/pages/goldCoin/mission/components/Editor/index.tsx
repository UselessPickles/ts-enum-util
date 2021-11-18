import { Form, Input, Modal, Radio } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { coinRuleList, coinRuleBatchUpdate } from '../../services/rule';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import Options from '@/utils/Options';
import { positiveInteger } from '../utils';
import ChildrenRender from '@/components/ChildrenRender';
import ItemLabel from 'antd/lib/form/FormItemLabel';
import React, { Fragment } from 'react';

const { Item, List } = Form;

export default ({
  formProps,
  drawerProps,
  setDrawerProps,
  onSuccess,
  form,
}: ReturnType<typeof useDrawerForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const detail = useQuery(['coinRuleList'], () => coinRuleList(), {
    refetchOnWindowFocus: false,
    onSuccess(res) {
      const data = prune(res?.data, isValidValue) ?? {};
      form.setFieldsValue({ data });
    },
  });

  const BtnMap = new Map([
    [1, '开启'],
    [2, '关闭'],
  ]);

  enum BtnEnum {
    '开启' = 1,
    '关闭',
  }

  const codeMap = {
    DailyGoldLimit: { inputProps: { addonAfter: '个' } },
    TodayGoldLimit: { inputProps: { addonAfter: '次' } },
    WithdrawalAmountLTVRatio: {
      labelProps: {
        tooltip:
          '用户每次提现，对用户提现金额与用广告行为与LTV收益进行对比，提现金额对比收益小于等于设置的范围，用户可提现，大于用户无法提现',
      },
      inputProps: {
        addonBefore: '<=',
        addonAfter: '%',
      },
    },
    DailyWithdrawalTimes: {
      inputProps: {
        addonAfter: '次',
      },
    },
  };

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      const format = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定积分设置吗？再次确定保存成功',
        onOk: async () => {
          try {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
            await coinRuleBatchUpdate({
              // 拼给后端
              ...format,
              throwErr: true,
            });
            await onSuccess?.();
            setDrawerProps((pre) => ({ ...pre, visible: false }));
          } catch (e: any) {
            console.error(e?.message);
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
      }}
      drawerProps={{
        ...drawerProps,
        confirmLoading: detail.isFetching,
        onOk: onSubmit,
        title: '金币规则配置',
      }}
    >
      <List name="data">
        {(fields) =>
          fields?.map(({ name, ...field }) => (
            <Fragment key={field.key}>
              <Item name={[name, 'id']} fieldKey={[field.fieldKey, 'id']} hidden>
                <Input />
              </Item>

              <Item name={[name, 'code']} fieldKey={[field.fieldKey, 'code']} hidden>
                <Input />
              </Item>

              <Item
                fieldKey={[field.fieldKey, 'name']}
                noStyle
                dependencies={[['data', name, 'code']]}
              >
                {({ getFieldValue }) => (
                  <Item name={[name, 'name']} fieldKey={[field.fieldKey, 'name']} noStyle>
                    <ChildrenRender<any>>
                      {({ value }) => (
                        <ItemLabel
                          prefixCls="ant-form"
                          label={value}
                          required
                          // @ts-ignore
                          {...codeMap?.[getFieldValue(['data', name, 'code'])]?.labelProps}
                        />
                      )}
                    </ChildrenRender>
                  </Item>
                )}
              </Item>

              <div style={{ display: 'flex', gap: 8 }} key={field.key as React.Key}>
                <Item name={[name, 'status']} fieldKey={[field.fieldKey, 'status']}>
                  <Radio.Group optionType="button" options={Options(BtnMap).toOpt} />
                </Item>
                <Item
                  noStyle
                  dependencies={[
                    ['data', name, 'code'],
                    ['data', name, 'status'],
                  ]}
                >
                  {({ getFieldValue }) =>
                    getFieldValue(['data', name, 'status']) === BtnEnum.开启 && (
                      <Item
                        name={[name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        style={{ flex: 1 }}
                        rules={[
                          { required: true },
                          { pattern: positiveInteger, message: '仅允许正整数' },
                        ]}
                      >
                        <Input
                          placeholder="0"
                          // @ts-ignore
                          {...codeMap?.[getFieldValue(['data', name, 'code'])]?.inputProps}
                        />
                      </Item>
                    )
                  }
                </Item>
              </div>
            </Fragment>
          ))
        }
      </List>
    </DrawerForm>
  );
};
