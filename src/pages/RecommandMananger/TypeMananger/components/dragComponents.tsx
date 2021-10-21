import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import styles from '../index.less';
function dragDirection(
  dragIndex: number,
  hoverIndex: number,
  initialClientOffset: { x: number; y: number },
  clientOffset: { x: number; y: number },
  sourceClientOffset: { x: number; y: number },
): 'downward' | 'upward' | void {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

function BodyRow(props: any) {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset,
    );
    className = `${className} ${direction === 'downward' ? styles.downward : styles.upward}`;
  }
  return connectDragSource(
    connectDropTarget(
      <tr {...restProps} className={className + ` ${styles.noDrag}`} style={style} />,
    ),
  );
}
const rowSource = {
  beginDrag(props: { index: any }) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(
    props: { index: any; moveRow: (arg0: any, arg1: any) => void },
    monitor: { getItem: () => { (): any; new (): any; index: any } },
  ) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  },
};

const DraggableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow),
);
export const dragComponents = {
  body: {
    row: DraggableBodyRow,
    // cell: EditableCell,
  },
};
