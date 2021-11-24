import { Form, Input, Modal } from 'antd';

import DrawerForm from '@/components/DrawerForm@latest';
import type useDrawerForm from '@/components/DrawerForm@latest/useDrawerForm';
import { services } from '../../services/taskDetail';

import { useQuery } from 'react-query';
import isValidValue from '@/utils/isValidValue';
import prune from '@/utils/prune';
import type { EdiTableColumnType } from '@/components/EdiTable';
import EdiTable from '@/components/EdiTable';
import { shouldUpdateManyHOF } from '@/decorators/shouldUpdateHOF';
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
  const { taskId, code } = data;
  const detail = useQuery(
    ['coin/task/detail/list', taskId],
    () => services.list({ data: { taskId } }),
    {
      enabled: !!taskId,
      refetchOnWindowFocus: false,
      onSuccess(res) {
        const formData = prune(res?.data, isValidValue);
        const sorted = formData?.sort(
          (a, b) => a?.commonCondition?.condition - b?.commonCondition?.condition,
        );
        form.setFieldsValue({ data: sorted });
      },
    },
  );

  async function onSubmit() {
    try {
      const value = await form?.validateFields();
      const format = prune(value, isValidValue);
      // const sorted =format?.map(f => ({...f, commonCondition: {condition: idx}}))

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

  const columns: EdiTableColumnType<any>[] = [
    {
      title: '天数',
      // canDrag: true,
      renderFormItem({ field }) {
        return <Item key={field.key}>第{field.name + 1}天</Item>;
      },
    },
    {
      title: '下发金币code',
      renderFormItem({ field }) {
        return (
          <Item shouldUpdate={shouldUpdateManyHOF([['data', field.name, 'coinRuleId']])} noStyle>
            {({ getFieldValue, setFields }) => (
              <Item
                key={field.key}
                fieldKey={[field.fieldKey, 'coinRuleId']}
                name={[field.name, 'coinRuleId']}
                rules={[{ required: true }]}
              >
                <Input
                  style={{ width: '100%' }}
                  // onBlur={async () => {
                  //   try {
                  //     const pre = getFieldValue(['data', field?.name]);
                  //     const coinParse =
                  //       (
                  //         await services['coin/parser']({
                  //           data: { coinRuleId: pre?.coinRuleId },
                  //         })
                  //       )?.data ?? {};

                  //     setFields([
                  //       {
                  //         name: ['data', field?.name],
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
        );
      },
    },
    {
      title: '下发金币数量',
      renderFormItem: ({ field }) => (
        <Item
          fieldKey={[field.fieldKey, 'minCoin']}
          key={field.key}
          name={[field.name, 'minCoin']}
          rules={[{ required: true }, { pattern: positiveInteger, message: '仅允许正整数' }]}
        >
          <Input placeholder="0" />
        </Item>
      ),
    },
    // {
    //   title: '下发金币数量',
    //   renderFormItem: ({ field }) => (
    //     <Item
    //       fieldKey={field.fieldKey}
    //       key={field.key}
    //       noStyle
    //       shouldUpdate={shouldUpdateManyHOF([['data', field.name]])}
    //     >
    //       {({ getFieldValue }) => (
    //         <Space>
    //           {getFieldValue(['data', field.name, 'minCoin']) ? (
    //             <Item name={[field.name, 'minCoin']}>
    //               <FormItemView />
    //             </Item>
    //           ) : (
    //             <Text type="secondary">根据填写积分规则ID解析</Text>
    //           )}
    //           {getFieldValue(['data', field.name, 'rewardType']) === REWARD_TYPE_ENUM.随机数额 && (
    //             <>
    //               ~
    //               {getFieldValue(['data', field.name, 'maxCoin']) && (
    //                 <Item name={[field.name, 'maxCoin']}>
    //                   <FormItemView />
    //                 </Item>
    //               )}
    //             </>
    //           )}
    //         </Space>
    //       )}
    //     </Item>
    //   ),
    // },
  ];

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        onFinish: onSubmit,
      }}
      drawerProps={{
        ...drawerProps,
        confirmLoading: detail.isFetching,
        onOk: onSubmit,
        title: '签到任务',
      }}
    >
      <EdiTable
        tableProps={{ columns, style: { border: '1px solid #E8EAEC' } }}
        formListProps={{
          name: 'data',
          initialValue: Array(7).fill({}),
        }}
      />
    </DrawerForm>
  );
};
