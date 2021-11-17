export default interface Row {
  status: number;
  id: string;
  operator?: string;
  utime?: string;
  code?: typeof MISSION_CODE[number];
}

export const MISSION_CODE = [
  'SmallBall',
  'SignIn',
  'FirstPlayGame',
  'StartGame',
  'BrowseGameDetails',
  'NewPeopleRedEnvelopes',
] as const;

export enum STATUS_ENUM {
  '启用' = 1,
  '禁用',
}
export const STATUS = new Map([
  [1, '启用'],
  [2, '禁用'],
]);

export const USER_TYPE = new Map([
  ['2', '新用户'],
  ['3', '老用户'],
]);

export enum USER_TYPE_ENUM {
  '新用户' = '2',
  '老用户' = '3',
}
