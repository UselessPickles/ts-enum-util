import type { ReactNode } from 'react';
import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
const { Item: DItem } = Descriptions;

export interface Row<T extends Record<string, any>> {
  field: string;
  title: string;
  render?: (text: any, record: T) => ReactNode;
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
    rows.forEach(({ field, title, render }) => {
      const v = ds[field],
        ele = render?.(v, ds) ?? v;
      if (Array.isArray(acc.get(title))) {
        acc.get(title)?.push(ele);
      } else {
        acc.set(title, [ele]);
      }
    });
    return acc;
  }, new Map());

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
