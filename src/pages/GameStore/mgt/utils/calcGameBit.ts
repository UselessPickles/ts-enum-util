import { GAME_BIT_ENUM } from '../models';

export interface ApkInfo {
  x86?: number;
  x64?: number;
}

export function calcGameBit(apkInfo: ApkInfo) {
  if (apkInfo.x86 && apkInfo.x64) return GAME_BIT_ENUM['32，64都支持'];
  if (apkInfo.x86) return GAME_BIT_ENUM['32位'];
  if (apkInfo.x64) return GAME_BIT_ENUM['64位'];
  return GAME_BIT_ENUM.未计算;
}
