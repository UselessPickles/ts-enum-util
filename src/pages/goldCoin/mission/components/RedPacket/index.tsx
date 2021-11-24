import { Form, Input, Modal, Alert } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/taskDetail';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';
import FormItemView from '@/components/FormItemView';
import { REWARD_TYPE_ENUM } from '../../models';
import compStyle from '../index.less';
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
  const { taskId, code } = data;
  const detail = useQuery(
    ['coin/task/detail/list', taskId],
    () => services.list({ data: { taskId } }),
    {
      enabled: !!taskId,
      refetchOnWindowFocus: false,
      onSuccess(res) {
        const formData = prune(res?.data, isValidValue);
        form.setFieldsValue({ data: formData });
      },
    },
  );

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      console.log('value', value);
      const format = prune(value, isValidValue);

      Modal.confirm({
        title: '请进行二次确认',
        content: '确定积分设置吗？再次确定保存成功',
        onOk: async () => {
          try {
            setDrawerProps((pre) => ({ ...pre, confirmLoading: true }));
            await services.saveOrUpdate({
              // 拼给后端
              data: format?.data?.map((d: any) => ({ ...d, taskId, code })),
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
        style: { marginTop: '34px' },
      }}
      drawerProps={{
        ...drawerProps,
        confirmLoading: detail.isFetching,
        title: (
          <>
            新人红包
            <Alert
              style={{
                position: 'absolute',
                transform: 'translate(0%, 50%)',
                width: '100%',
                left: '0',
              }}
              banner
              message="每个用户最多获得1次，第一次进入我的页面，即下发金币"
            />
          </>
        ),
        onOk: onSubmit,
      }}
    >
      <Item shouldUpdate={shouldUpdateManyHOF([['data', 0, 'coinRuleId']])} noStyle>
        {({ getFieldValue, setFields }) => (
          <Item name={['data', 0, 'coinRuleId']} label="下发金币code" rules={[{ required: true }]}>
            <Input
              style={{ width: '100%' }}
              // onBlur={async () => {
              //   try {
              //     const pre = getFieldValue(['data', 0]);
              //     const coinParse =
              //       (
              //         await services['coin/parser']({
              //           data: { coinRuleId: pre?.coinRuleId },
              //         })
              //       )?.data ?? {};

              //     setFields([
              //       {
              //         name: ['data', 0],
              //         value: { ...pre, ...coinParse },
              //       },
              //     ]);
              //   } catch (e) {
              //     console.error(e);
              //   }
              // }}
              placeholder="请填写中台的积分规则ID"
            />
          </Item>
        )}
      </Item>

      {/* <Item label={'下发金币数量'} shouldUpdate={shouldUpdateManyHOF([['data', 0]])}>
        {({ getFieldValue }) => (
          <div className={compStyle['coin-view']}>
            {getFieldValue(['data', 0, 'minCoin']) ? (
              <Item name={['data', 0, 'minCoin']}>
                <FormItemView />
              </Item>
            ) : (
              '根据填写积分规则ID解析'
            )}
            {getFieldValue(['data', 0, 'rewardType']) === REWARD_TYPE_ENUM.随机数额 && (
              <>
                ~
                {getFieldValue(['data', 0, 'maxCoin']) && (
                  <Item name={['data', 0, 'maxCoin']}>
                    <FormItemView />
                  </Item>
                )}
              </>
            )}
          </div>
        )}
      </Item> */}
      <Item label={'下发金币数量'} name={['data', 0, 'id']} hidden>
        <Input placeholder="0" />
      </Item>
    </DrawerForm>
  );
};
