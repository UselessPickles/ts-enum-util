/** string */
export const arr2str = (arr: string[]) => arr?.join?.();
export const str2arr = (str: string) => (str ? str?.split?.(',') : []);

import getFileNameInPath from '../../utils/file/getFileNameInPath';
/** file */
import type { FormItemProps } from 'antd';
export type File = { url?: string; response?: string; [key: string]: any };
export type FileList = (File[] & { toJSON?: () => any }) | undefined;

export const getValueFromEvent: FormItemProps['getValueFromEvent'] = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const normalize: FormItemProps['normalize'] = (v) => {
  return v?.[0];
};

// signal file
export const str2fileList = (value?: string): FileList =>
  typeof value === 'string'
    ? [{ uid: value, response: value, url: value, thumbUrl: value, name: getFileNameInPath(value) }]
    : value;

export const uploadEvent2str: FormItemProps['normalize'] = (value) => value?.[0]?.response ?? value;

// multiple file
export const strArr2fileList = (value?: string[]): FileList =>
  value?.map?.((v) =>
    typeof v === 'string' ? { response: v, url: v, thumbUrl: v, name: v, uid: v } : v,
  );

export const uploadEvent2strArr: FormItemProps['normalize'] = (value) =>
  value?.map((v: any) => v?.response ?? v) ?? value;

/** date */
import type { Moment } from 'moment';
import moment from 'moment';
export const moment2str = (v?: Moment) => v?.format('YYYY-MM-DD HH:mm:ss') ?? v;
export const str2moment = (v?: string) => (v ? moment(v) : undefined);
export const momentFormat = (format: string) => (v?: Moment) => v?.format(format);