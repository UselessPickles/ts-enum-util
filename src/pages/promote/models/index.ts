export default interface Promote {
  creator: string;
  ctime: string;
  gameNamePkg: string;
  id: number;
  operator: string;
  platform: number;
  platformName: string;
  popularizePlanId: number;
  popularizePlanName: string;
  status: number;
  utime: string;
}

export enum PLATFORM {
  '穿山甲' = 1,
  '快手',
}
