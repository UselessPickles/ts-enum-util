import type { ReactElement, ReactNode } from 'react';
import React, { Fragment, useRef } from 'react';
import { Form, Tooltip } from 'antd';
import type { GridTitleProp } from '@/components/GridTitle';
import GridTitle from '@/components/GridTitle';
import { useDrag, useDrop } from 'react-dnd';

import type { FormListFieldData, FormListOperation, FormListProps } from 'antd/es/form/FormList';

import { InfoCircleOutlined } from '@ant-design/icons';

import styled from 'styled-components';

const ItemWrap = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export interface DnDFormColumn {
  title: ReactNode;
  render: (args: { field: FormListFieldData; idx: number } & FormListChildren) => ReactNode;
  span?: number;
  canDrag?: boolean;
  tooltip?: ReactNode;
}

export interface DnDFormProps {
  columns: DnDFormColumn[];
  name: FormListProps['name'];
  titleStyle?: React.CSSProperties;
  titleRowProps?: GridTitleProp;

  rowStyle?: React.CSSProperties;
  rowProps?: GridTitleProp;
  formListProps?: Partial<FormListProps>;
  children?: (
    args: {
      title?: ReactElement;
      body?: ReactElement;
    } & FormListChildren,
  ) => ReactElement;
}

export interface FormListChildren {
  fields: FormListFieldData[];
  operation: FormListOperation;
  meta: {
    errors: React.ReactNode[];
  };
}

export default (props: DnDFormProps) => <DnDForm {...props} />;

export function DnDForm({
  columns,
  name,
  titleStyle,
  titleRowProps,
  rowProps,
  rowStyle,
  formListProps,
  children,
}: DnDFormProps) {
  const [, drop] = useDrop(() => ({ accept: `${name}` }));

  const { cols, titles } = columns?.reduce(
    (acc: { cols: number[]; titles: ReactNode[] }, col, idx: number) => {
      const { cols: c, titles: t } = acc;
      return {
        cols: [...c, col?.span ?? 1],
        titles: [
          ...t,
          <Fragment key={idx}>
            {col?.title}
            {col.tooltip && (
              <>
                {' '}
                <Tooltip title={col.tooltip}>
                  <InfoCircleOutlined />
                </Tooltip>
              </>
            )}
          </Fragment>,
        ],
      };
    },
    {
      cols: [],
      titles: [],
    },
  );

  const calcedCols = calcSpan(cols);

  return (
    <Form.List name={name} {...formListProps}>
      {(fields, operation, meta) => {
        const title = (
          <GridTitle
            style={{
              margin: 'unset',
              minHeight: 36,
              fontWeight: 500,
              textAlign: 'left',
              background: '#F1F4F9',
              ...titleStyle,
            }}
            {...titleRowProps}
            cols={calcedCols}
          >
            {titles}
          </GridTitle>
        );
        const body = (
          <div ref={drop}>
            {fields?.map((field) => (
              <DraggableItem
                key={field.key}
                columns={columns}
                name={`${name}`}
                field={field}
                rowProps={rowProps}
                rowStyle={rowStyle}
                operation={operation}
                fields={fields}
                meta={meta}
              />
            ))}
          </div>
        );
        return children ? (
          children?.({ title, body, fields, operation, meta })
        ) : (
          <>
            {title}
            {body}
            <Form.ErrorList errors={meta?.errors} />
          </>
        );
      }}
    </Form.List>
  );
}

// draggable item
function DraggableItem({
  columns,
  name,
  field,
  rowProps,
  rowStyle,
  fields,
  operation,
  meta,
}: {
  field: FormListFieldData;
} & Partial<DnDFormProps> &
  FormListChildren) {
  const cols = calcSpan(columns?.map((col) => col.span ?? 1) as number[]);

  const key = field?.key;

  const debounce = useRef<number>(Date.now());

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: name as string,
      item: { name: field.name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [field.name],
  );

  const [, dropItem] = useDrop(
    () => ({
      accept: name as string,
      canDrop: () => false,
      hover(item: { name: number }) {
        if (item.name !== field.name && debounce?.current < Date.now()) {
          operation?.move && operation?.move?.(item.name, field.name);
          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          item.name = field.name;
          debounce.current = Date.now() + 1000;
        }
      },
    }),
    [operation?.move, field.name],
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <GridTitle
      ref={(node) => dragPreview(dropItem(node))}
      style={{
        opacity,
        margin: 'unset',
        padding: '16px 0',
        border: '1px solid #E8EAEC',
        borderTop: 'unset',
        ...rowStyle,
      }}
      cols={cols}
      key={key}
      {...rowProps}
    >
      {columns?.map((col) => {
        const { render, canDrag } = col;

        const child = (
          <ItemWrap>{render({ field, idx: field.name, fields, operation, meta })}</ItemWrap>
        );

        if (canDrag) {
          return (
            <div key={field.key} ref={drag}>
              {child}
            </div>
          );
        }
        return <Fragment key={field.key}>{child}</Fragment>;
      })}
    </GridTitle>
  );
}

function calcSpan(cols: number[], base: number = 24) {
  const total = cols.reduce((acc, cur) => acc + cur, 0);
  const tmp = cols.map((col) => Math.round((col / total) * base));
  const offset = tmp.reduce((acc, cur) => acc + cur, 0) - base;
  if (offset > 0) {
    let maxIdx = 0;
    tmp.forEach((i, idx) => {
      if (i > tmp[maxIdx]) {
        maxIdx = idx;
      }
    });
    tmp[maxIdx] -= offset;
  }

  return tmp;
}
