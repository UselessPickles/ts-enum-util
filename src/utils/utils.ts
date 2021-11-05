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

export function download(data: any, fileName: string, contentType?: string) {
  let elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';

  let blob = new Blob([data], {
    type: contentType || 'application/octet-stream',
  });

  elink.href = URL.createObjectURL(blob);

  document.body.appendChild(elink);
  elink.click();

  document.body.removeChild(elink);
}
