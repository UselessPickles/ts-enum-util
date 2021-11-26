import type { RowProps } from 'antd';
import { Col, Row } from 'antd';
import type { ReactNodeArray } from 'react';
import React, { forwardRef, Fragment } from 'react';

export type GridTitleProp = RowProps &
  React.RefAttributes<HTMLDivElement> & {
    cols: number[];
  };

export default forwardRef<HTMLDivElement, GridTitleProp>(
  ({ children, cols, ...props }: GridTitleProp, ref) => (
    <Row align="middle" gutter={8} ref={ref} {...props}>
      {(children as ReactNodeArray)?.map((c, i) =>
        cols[i] ? (
          <Col span={cols[i]} key={i}>
            {c}
          </Col>
        ) : (
          <Fragment key={i}>{c}</Fragment>
        ),
      )}
    </Row>
  ),
);
