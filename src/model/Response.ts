export type Response<T> = {
  page_no: number;
  page_size: number;
  total_count: number;
  total_datas: T[];
};
