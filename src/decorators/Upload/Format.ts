export type File = { url?: string; response?: string; [key: string]: any };
export type FileList = (File[] & { toJSON?: () => any }) | undefined;

/** signal file */
export const str2fileList = (value?: string): FileList =>
  typeof value === 'string' ? [{ response: value, url: value, thumbUrl: value }] : value;

export const uploadEvent2str = (value: { fileList?: FileList }): FileList => {
  const fileList = value?.fileList;
  if (typeof fileList === 'object') {
    fileList.toJSON = function () {
      return this?.[0]?.response;
    };
  }
  return fileList ?? [];
};

/** multiple file */
export const strArr2fileList = (value?: string[]): FileList =>
  value?.map?.((v) => (typeof v === 'string' ? { response: v, url: v, thumbUrl: v } : v));

export const uploadEvent2strArr = (value: { fileList?: FileList }): FileList => {
  const fileList = value?.fileList;
  if (typeof fileList === 'object') {
    fileList.toJSON = function () {
      return this?.map((v) => v?.response);
    };
  }
  return fileList ?? [];
};
