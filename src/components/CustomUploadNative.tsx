import React from 'react';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import RESTful from '@/utils/RESTful';
import getExt from '@/utils/file/getExt';

export function uniKey(file: File & { uid: string }) {
  return `${PROCESS_ENV.APP_NAME}/${file.uid}.${getExt(file.name)}`;
}

export default (props: React.PropsWithChildren<UploadProps>) => (
  <Upload
    customRequest={async ({ onSuccess, onError, onProgress, file }) => {
      const xhr = new XMLHttpRequest();
      xhr.onerror = (...args) => {
        console.log('xhr.onerror', ...args);
      };
      xhr.onload = (...args) => {
        console.log('xhr.onload', ...args);
      };

      xhr.onprogress = (...args) => {
        console.log('xhr.onprogress', ...args);
      };

      xhr.open(
        'post',
        'http://commerce-dev.yingzhongshare.com/game_spider566_service/game_spider566_service/upload',
      );

      const tokenKey = uniKey(file as any);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('key', tokenKey);
      xhr.send(fd);

      try {
        onSuccess?.(`https://image.quzhuanxiang.com/${tokenKey}`, xhr);
      } catch (e: any) {
        onError?.(e);
      }
    }}
    {...props}
  />
);
