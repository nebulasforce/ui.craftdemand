export interface Pagination<T> {
  count: number;
  lists: T[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Response<T> {
  success: boolean;
  code: number;
  message?: string;
  meta?: {
    requestId?: string;
  };
  data: T;
}

export interface Result {
  result: boolean;
}
