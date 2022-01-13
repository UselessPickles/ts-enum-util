import Chain from '../../../struct/chain';
import type { Node } from '../../../struct/chain';
import type { TableColumnProps } from 'antd';

export type Render<RecordType extends Record<any, any> = any> = (
  preRender: React.ReactNode,
  record: RecordType,
  index: number,
  value: any,
) => React.ReactNode;

export class RenderNode<RecordType> implements Node {
  render?: Render;
  next?: RenderNode<RecordType>;
  name: string | undefined;

  constructor(render?: TableColumnProps<RecordType>['render']) {
    this.render = render;
    this.name = render?.name;
  }
}

export class RenderChain<RecordType> extends Chain<RenderNode<RecordType>> {
  public Concat(c: RenderChain<RecordType>) {
    return new RenderChain<RecordType>(...this, ...c);
  }
}
