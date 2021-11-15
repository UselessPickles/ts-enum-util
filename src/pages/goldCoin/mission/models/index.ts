export default interface Row {
  gameSource: string;
  testStatus: TEST_STATUS_ENUM;
  id: string;
  gameNum: string;
  operator?: string;
  ctime?: string;
  versionList?: Row[];
  gameName: string;
  briefIntroduction: string;
  detailedIntroduction: string;
  gameIcon: string;
  dynamicPicture: string;
  gamePicture: string;
  gameVideoList: string[];
  gameVideoListVideo: string[];
  score: string;
  thirdGameClassify: string;
  gameClassifyId: string;
  apk: string;
  insideVersion: string;
  externalVersion: string;
  md5: string;
  gameBit: string;
  installType: INSTALL_TYPE_ENUM;
}

export const TYPE = new Map([
  ['游戏资料', '游戏资料'],
  ['资源信息', '资源信息'],
  ['商务信息', '商务信息'],
  ['更新记录', '更新记录'],
]);

export const PROFIT_MODE = new Map([
  ['1', '广告'],
  ['2', '内购'],
  ['3', '网赚'],
]);

export const INSTALL_TYPE = new Map([
  [1, '内部安装'],
  [2, '应用外安装'],
]);

export const STATUS = new Map([
  [1, '上线'],
  [2, '下线'],
]);

export enum INSTALL_TYPE_ENUM {
  '内部安装' = 1,
  '应用外安装',
}

export enum TEST_STATUS_ENUM {
  '未开始',
  '测试中',
  '测试成功',
  '测试失败',
}

export const TEST_STATUS = new Map<TEST_STATUS_ENUM, string>([
  [1, '未开始'],
  [2, '测试中'],
  [3, '测试成功'],
  [4, '测试失败'],
]);

export type ENV = 'prod' | 'test';
