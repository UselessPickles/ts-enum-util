export default interface Row {
  id: 'string';
}

export const TYPE = new Map([
  ['游戏资料', '游戏资料'],
  ['资源信息', '资源信息'],
  ['商务信息', '商务信息'],
  ['更新记录', '更新记录'],
]);

export const GAIN_TYPE = new Map([
  ['广告', '广告'],
  ['内购', '内购'],
  ['网赚', '网赚'],
]);

export const INSTALL_TYPE = new Map([
  ['内部安装', '内部安装'],
  ['应用外安装', '应用外安装'],
]);
