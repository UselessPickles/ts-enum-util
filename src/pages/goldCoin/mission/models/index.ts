export default interface Row {
  status: number;
  id: string;
  operator?: string;
  utime?: string;
}

export enum STATUS_ENUM {
  '禁用',
  '启用',
}
export const STATUS = new Map([
  [0, '禁用'],
  [1, '启用'],
]);
