export interface Pagination<T> {
  count: number;
  lists: T[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Response<T> {
  code: number;
  message?: string;
  data?: T;
}
