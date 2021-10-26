export default interface Row {
  id: 'string';
}

export const TYPE = new Map([
  ['游戏资料', '游戏资料'],
  ['资源信息', '资源信息'],
  ['商务信息', '商务信息'],
  ['更新记录', '更新记录'],
]);

export const PROFIT_MODE = new Map([
  ['广告', '广告'],
  ['内购', '内购'],
  ['网赚', '网赚'],
]);

export const INSTALL_TYPE = new Map([
  [1, '内部安装'],
  [2, '应用外安装'],
]);

export const STATUS = new Map([
  [1, '上线'],
  [2, '下线'],
]);
export const TEST_STATUS = new Map([
  [1, '未开始'],
  [2, '测试中'],
  [3, '测试成功'],
  [4, '测试失败'],
]);
