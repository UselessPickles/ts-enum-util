import type { FormItemProps } from 'antd';
export type File = { url?: string; response?: string; [key: string]: any };
export type FileList = (File[] & { toJSON?: () => any }) | undefined;
export function getFileNameInPath(path: string) {
  const arr = path?.split?.('/');
  return arr?.[arr?.length - 1];
}

export const getValueFromEvent: FormItemProps['getValueFromEvent'] = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const normalize: FormItemProps['normalize'] = (v) => {
  return v?.[0];
};

/** signal file */
export const str2fileList = (value?: string): FileList =>
  typeof value === 'string'
    ? [{ response: value, url: value, thumbUrl: value, name: getFileNameInPath(value) }]
    : value;

export const uploadEvent2str: FormItemProps['normalize'] = (value) => value?.[0]?.response ?? value;

/** multiple file */
export const strArr2fileList = (value?: string[]): FileList =>
  value?.map?.((v) => (typeof v === 'string' ? { response: v, url: v, thumbUrl: v, name: v } : v));

export const uploadEvent2strArr: FormItemProps['normalize'] = (value) =>
  value?.map((v: any) => v?.response ?? v) ?? value;
