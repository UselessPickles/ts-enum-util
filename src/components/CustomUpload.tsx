import React from 'react';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import RESTful from '@/utils/RESTful';

export function getExt(fileName: string): string {
  const arr = fileName?.split('.');
  return arr[arr?.length - 1];
}

export function getQiniuKey(file: File & { uid: string }) {
  return `${PROCESS_ENV.APP_NAME}/${file.uid}.${getExt(file.name)}`;
}

export default (props: React.PropsWithChildren<UploadProps>) => (
  <Upload
    customRequest={async ({ onSuccess, onError, file }) => {
      const tokenKey = getQiniuKey(file as any);

      try {
        const data = await RESTful.get('', {
          fullUrl: `/intelligent-manager/api/material/getQiniuToken?fileNameList=${tokenKey}`,
          throwErr: true,
        }).then((res) => res?.data);

        if (!data) {
          onError?.(new Error('上传失败'));
        }

        const fd = new FormData();
        fd.append('file', file);
        fd.append('token', data?.[tokenKey]);
        fd.append('key', tokenKey);

        await fetch('https://upload.qiniup.com', {
          method: 'POST',
          body: fd,
        });

        const xhr = new XMLHttpRequest();
        onSuccess?.(`https://image.quzhuanxiang.com/${tokenKey}`, xhr);
      } catch (e: any) {
        onError?.(e);
      }
    }}
    {...props}
  />
);
