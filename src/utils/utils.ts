import crypto from 'crypto';

/**
 * @description md5加密
 * @param {String} str
 */
export function getmd5(str: string): string {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  const encryption = md5.digest('hex');
  return encryption;
}
