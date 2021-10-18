import { ProColumns } from '@ant-design/pro-table';
import { ColProps } from 'antd';

export type XmilesCol<T = any> = Omit<ProColumns<T>, 'valueType'> & {
  tooltip?: string;
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
