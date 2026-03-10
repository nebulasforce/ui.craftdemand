import { ApiWithOutId, Api } from '@/api/api/typings';
import { Response, Pagination, Result } from '@/api/common/response';

export interface Item extends ApiWithOutId {}

export interface listData extends Pagination<Api> {}

export interface listResponse extends Response<listData> {}

export type listAllData = Api[];

export interface listAllResponse extends Response<listAllData> {}

export type getApiData = Api;

export interface getApiResponse extends Response<getApiData> {}

export interface createApiData extends Result {
  id: string;
}

export interface createApiResponse extends Response<createApiData> {}

export interface editApiData extends Result {
  id: string;
}

export interface editApiResponse extends Response<editApiData> {}

export interface deleteApiData extends Result {
  count: number;
}

export interface deleteApiResponse extends Response<deleteApiData> {}
