import type { ProColumns } from '@ant-design/pro-table';
import type { ColProps } from 'antd';

export type XmilesCol<T = any> = Omit<ProColumns<T>, 'valueType'> & {
  isCollapsed?: boolean;
  bordered?: boolean;
  colSize?: number;
  renderItem?: (col: XmilesCol, colProps: ColProps) => React.ReactElement;
  valueType?:
    | ProColumns<T>['valueType']
    | 'null'
    | 'prdSubscriber'
    | 'gPrdSubscriber'
    | 'allPrdSubscriber';
};
