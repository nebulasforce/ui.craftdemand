import { Query, Pager } from '@/api/common/request';

export interface listRequest extends Query, Pager {}

export interface listAllRequest extends Query {}

export interface getApiRequest extends Query {
  id: string;
}

export interface createApiRequest {
  name: string;
  module?: string;
  path: string;
  method: string;
  description?: string;
  group?: string;
  type?: number;
  sort?: number;
  status?: number;
}

export interface editApiRequest {
  id: string;
  name: string;
  module?: string;
  path: string;
  method: string;
  description?: string;
  group?: string;
  type?: number;
  sort?: number;
  status?: number;
}

export interface deleteApiRequest {
  ids: string[];
}
