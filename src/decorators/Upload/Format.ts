export type File = { url?: string; response?: string; [key: string]: any };
export type FileList = (File[] & { toJSON?: () => any }) | undefined;
export function getFileNameInPath(path: string) {
  const arr = path?.split?.('/');
  return arr?.[arr?.length - 1];
}
/** signal file */
export const str2fileList = (value?: string): FileList =>
  typeof value === 'string'
    ? [{ response: value, url: value, thumbUrl: value, name: getFileNameInPath(value) }]
    : value;

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
  value?.map?.((v) => (typeof v === 'string' ? { response: v, url: v, thumbUrl: v, name: v } : v));

export const uploadEvent2strArr = (value: { fileList?: FileList }): FileList => {
  const fileList = value?.fileList;
  if (typeof fileList === 'object') {
    fileList.toJSON = function () {
      return this?.map((v) => v?.response);
    };
  }
  return fileList ?? [];
};
