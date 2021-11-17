export default interface Row {
  status: number;
  id: string;
  operator?: string;
  utime?: string;
}

export enum STATUS_ENUM {
  '启用' = 1,
  '禁用',
}
export const STATUS = new Map([
  [1, '启用'],
  [2, '禁用'],
]);

export const USER_TYPE = new Map([
  ['0', '新用户'],
  ['1', '老用户'],
]);

export enum USER_TYPE_ENUM {
  '新用户',
  '老用户',
}
