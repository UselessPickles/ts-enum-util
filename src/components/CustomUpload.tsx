import React, { useEffect, useRef } from 'react';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';

import OSS from 'ali-oss';
import RESTful from '@/utils/RESTful';
import Interval from '@/utils/Interval';

export default (props: React.PropsWithChildren<UploadProps>) => {
  const inv = useRef(new Interval(1000));

  useEffect(() => {
    return () => {
      inv.current.stop();
    };
  }, []);

  return (
    <Upload
      customRequest={async ({ onSuccess, onError, onProgress, file, action }) => {
        const upSpd = 50;
        const estimate = (file as any)?.size / 1024 / upSpd;

        let progress = 0;

        inv.current.onPoll = () => {
          if (progress < 60) {
            progress += 100 / estimate;
          } else {
            progress += (100 - progress) / (Math.random() * 10);
          }
          onProgress?.({ percent: progress } as any);
        };

        inv.current.run();

        try {
          const data =
            (await RESTful.post('fxx/game/credentials', {
              method: 'POST',
              throwErr: true,
            }).then((res) => res?.data)) ?? {};

          if (!data) {
            throw new Error('授权失败');
          }

          const { cndDomain } = data;

          const f: any = file;
          const client = new OSS({ ...data, stsToken: data?.securityToken });
          const path = `${action}/${f?.uid}-${f?.name}`;
          const res = await client.put(path, file);

          if (res?.res?.status !== 200) {
            throw new Error('上传失败');
          }

          const xhr = new XMLHttpRequest();
          onSuccess!(`${cndDomain}/${path}`, xhr);
        } catch (e: any) {
          onError!(e);
        } finally {
          inv.current.stop();
        }
      }}
      {...props}
    />
  );
};
