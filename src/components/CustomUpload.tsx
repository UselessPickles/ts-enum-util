import React from 'react';
import { Upload, UploadProps } from 'antd';
import RESTful from '@/utils/RESTful';

export default (props: React.PropsWithChildren<UploadProps>) => (
  <Upload
    customRequest={async ({ onSuccess, onError, file }) => {
      try {
        const { token, key } =
          (await RESTful.post('', {
            fullUrl: '/utils_service/common?funid=39&rd=1542186552060',
            data: {
              phead: {},
              ispage: 1,
            },
            throwErr: true,
          }).then((res) => res?.upload?.[0])) || {};

        if (!token || !key) {
          throw new Error('上传失败');
        }

        const fd = new FormData();
        fd.append('file', file);
        fd.append('token', token);
        fd.append('key', key);

        await fetch('https://up.qbox.me', {
          method: 'POST',
          body: fd,
        });

        const xhr = new XMLHttpRequest();
        onSuccess!(`https://img.xmiles.cn/${key}`, xhr);
      } catch (e: any) {
        onError!(e);
      }
    }}
    {...props}
  />
);
