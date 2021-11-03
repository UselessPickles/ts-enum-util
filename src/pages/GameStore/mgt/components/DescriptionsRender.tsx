import type { ReactNode } from 'react';
import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
import type { Key } from '@/utils/setTo';
import getIn from '@/utils/getIn';
import isValidValue from '@/utils/isValidValue';
const { Item: DItem } = Descriptions;

export interface Row<T extends Record<string, any>> {
  name: Key | Key[];
  label: string;
  format?: (text: any, record: T) => ReactNode;
}
export interface DescriptionsRenderProps<T> extends DescriptionsProps {
  rows: Row<T>[];
  dataSource: T[];
}

export function DescriptionsRender<T extends Record<string, any>>({
  rows,
  dataSource,
  labelStyle,
  ...descriptionsProps
}: DescriptionsRenderProps<T>) {
  const preprocess = dataSource.reduce((acc: Map<string, ReactNode[]>, ds) => {
    for (const { name, label, format } of rows) {
      const v = getIn(ds, name),
        ele = format?.(v, ds) ?? v;
      if (Array.isArray(acc.get(label))) {
        if (!isValidValue(acc.get(label)?.[0]) && !isValidValue(v)) {
          acc.delete(label);
        } else {
          acc.get(label)?.push(ele);
        }
      } else {
        acc.set(label, [ele]);
      }
    }
    return acc;
  }, new Map());

  console.log(preprocess, 'preprocess');

  function renderChildren() {
    let children: ReactNode[] = [];
    for (const [k, v] of preprocess?.entries()) {
      children = children.concat(
        v?.map((node, idx) => (
          <DItem
            labelStyle={idx === 0 ? { minWidth: '160px', ...labelStyle } : undefined}
            label={idx === 0 ? <b>{k}</b> : undefined}
            key={idx}
          >
            {node ?? ''}
          </DItem>
        )),
      );
    }
    return children;
  }

  return (
    <Descriptions
      contentStyle={{ width: '50%' }}
      column={dataSource?.length}
      {...descriptionsProps}
    >
      {renderChildren()}
    </Descriptions>
  );
}
