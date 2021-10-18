import React from 'react';
import { Form } from 'antd';

import { useQuery } from 'react-query';

import SearchSelect from '@/components/SearchSelect';
import request from '@/utils/request';
import Options from '@/utils/Options';
import { isValidValue } from '@/components/Xmiles/Search';
import Format from '@/decorators/Format';
import { IOC } from '@/decorators/hoc';
import { PureSearchAsync } from '@/decorators/Select/SearchAsync';
import { PureSelectAllInject } from '@/decorators/Select/SelectAllInject';
import { compose } from '../utils';

const { Item } = Form;

export default () => {
  return (
    <Form onFinish={console.log}>
      <Item name="test" label="test">
        {compose<ReturnType<typeof SearchSelect>>(
          IOC([
            PureSelectAllInject({
              inject: {
                label: '通用',
                value: 'ALL',
              },
            }),
            Format({
              f: (value: any) => value?.join?.(','),
              g: (value: any) =>
                isValidValue(value) ? value?.split?.(',') : undefined,
            }),
          ]),
          PureSearchAsync({
            query: () =>
              useQuery(
                [
                  'scenead/overseas/marketing_auditing/list_dictionaries',
                  'country',
                ],
                () =>
                  request({
                    api: `scenead/overseas/marketing_auditing/list_dictionaries?dictCode=${'country'}`,
                  }).then(
                    (res) =>
                      Options(
                        res?.data?.reduce(
                          (acc: Map<any, any>, biz: { key: any; value: any }) =>
                            acc.set(biz.key, biz.value),
                          new Map(),
                        ),
                      ).toOpt,
                  ),
              ),
          }),
        )(<SearchSelect onChange={console.log} mode="multiple" />)}
      </Item>
      <button html-type="submit">submit</button>
    </Form>
  );
};
