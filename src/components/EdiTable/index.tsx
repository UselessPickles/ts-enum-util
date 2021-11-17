import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { TableProps } from 'antd';
import { Table, Form } from 'antd';
import type { FormListProps } from 'antd/lib/form/FormList';
import type { ColumnType } from 'antd/lib/table';
import { useDrag, useDrop } from 'react-dnd';

import styles from './index.less';

type FormListChildrenParams = Parameters<FormListProps['children']>;
interface FormListChildrenParamsInterface {
  fields: FormListChildrenParams[0];
  operation: FormListChildrenParams[1];
  meta: FormListChildrenParams[2];
}

export interface RenderFormItemParams extends FormListChildrenParamsInterface {
  field: FormListChildrenParams[0][number];
}
export type RenderFormItem = (params: RenderFormItemParams) => ReactNode;

export interface EdiTableColumnType<P> extends ColumnType<P> {
  renderFormItem?: RenderFormItem;
  canDrag?: boolean;
}
export interface EdiTableProps<RecordType> {
  formListProps: Omit<FormListProps, 'children'>;
  tableProps: Omit<TableProps<RecordType>, 'columns'> & {
    columns: EdiTableColumnType<RecordType>[];
  };
  children?: (
    params: {
      body: ReactNode;
    } & FormListChildrenParamsInterface,
  ) => ReactNode;
}

const { List, Item, ErrorList } = Form;

export default <RecordType extends Record<string, any> = any>({
  formListProps,
  tableProps,
  children,
}: EdiTableProps<RecordType>) => {
  const name = formListProps?.name;

  const { columns, ...restTableProps } = tableProps;

  return (
    <div className={styles.editable}>
      <List {...formListProps}>
        {(fields, operation, meta) => {
          const injectColumns: any = columns?.map?.(({ renderFormItem, canDrag, ...column }) => ({
            ...column,
            onCell: (_: any, idx: any) => ({
              name,
              canDrag,
              renderFormItem,
              field: fields[idx],
              fields,
              operation,
              meta,
            }),
          }));

          const body = (
            <>
              <Item noStyle dependencies={[name]}>
                {({ getFieldValue }) => (
                  <Table
                    onRow={(_, idx) =>
                      ({
                        name,
                        field: fields?.[idx as number],
                        fields,
                        operation,
                        meta,
                      } as any)
                    }
                    components={{
                      body: {
                        cell: DnDCell,
                        row: DnDRow,
                      },
                    }}
                    dataSource={getFieldValue(name)}
                    pagination={false}
                    columns={injectColumns}
                    {...restTableProps}
                  />
                )}
              </Item>
              <ErrorList errors={meta?.errors} />
            </>
          );

          return children?.({ body, fields, operation, meta }) ?? body;
        }}
      </List>
    </div>
  );
};

export function DnDRow({
  name,
  renderFormItem,
  field,
  fields,
  operation,
  meta,
  className,
  children,
  ...props
}: {
  renderFormItem: RenderFormItem;
  [key: string]: any;
} & RenderFormItemParams) {
  const rowRef = useRef(null);

  const [{ isOver, dropClassName }, drop] = useDrop<any, any, any>(
    {
      accept: name ?? 'default',
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem<any>() || {};
        if (dragIndex === field?.name) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < field?.name ? 'drop-over-downward' : 'drop-over-upward',
        };
      },
      drop: (item) => {
        operation.move(item.index, field?.name);
      },
    },
    [name, field.name],
  );

  drop(rowRef);
  return (
    <tr
      ref={rowRef}
      className={`${className} ${isOver ? styles?.[dropClassName] : ''}`}
      children={children?.map?.((child: any) => ({
        ...child,
        props: {
          ...child?.props,
          additionalProps: { ...child?.props?.additionalProps, rowRef },
        },
      }))}
      {...props}
    />
  );
}

export function DnDCell({
  name,
  renderFormItem,
  field,
  fields,
  operation,
  meta,
  rowRef,
  canDrag,
  style,
  ...props
}: {
  renderFormItem: RenderFormItem;
  [key: string]: any;
} & RenderFormItemParams) {
  const [, drag, dragPreview] = useDrag(
    {
      type: name ?? 'default',
      item: { index: field?.name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [name, field.name],
  );

  dragPreview(rowRef);

  return (
    <td ref={canDrag && drag} {...props} style={{ cursor: canDrag ? 'grab' : undefined, ...style }}>
      {renderFormItem?.({ field, fields, operation, meta }) ?? props?.children}
    </td>
  );
}
