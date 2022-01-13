import reverseSplitJoin from '../../utils/reverseSplitJoin';
import type { TableColumnProps } from 'antd';
import moment from 'moment';
import type { ValueType } from '../type';

const dataFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

export const _valueTypeRegister = <RecordType>(
  valueType: ValueType,
): TableColumnProps<RecordType>['render'] => {
  const register: Partial<Record<ValueType, TableColumnProps<RecordType>['render']>> = {
    date: (v) => moment(v)?.format(dataFormat),
    dateTime: (v) => moment(v)?.format(`${dataFormat} ${timeFormat}`),
    time: (v) => moment(v)?.format(`${timeFormat}`),
    dateRange: (vv: string) =>
      vv
        ?.split?.(',')
        ?.map((v) => moment(v)?.format(`${timeFormat}`))
        ?.join(','),
    dateTimeRange: (vv: string) =>
      vv
        ?.split?.(',')
        ?.map((v) => moment(v)?.format(`${dataFormat} ${timeFormat}`))
        ?.join(','),
    digit: (v) => reverseSplitJoin({ num: v, split: ',', limit: 3 }),
  };

  return register[valueType];
};
