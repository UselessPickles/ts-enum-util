export default interface Row {
  id?: string;
}
export enum STATUS_ENUM {
  '隐藏',
  '展示',
}

export const STATUS = new Map([
  [1, '展示'],
  [0, '隐藏'],
]);
