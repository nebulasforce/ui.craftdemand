import { Query, Pager } from '@/api/common/request';

export interface listFrontRequest extends Query, Pager {}

export interface listRequest extends Query, Pager {}

export interface getMenuRequest extends Query {
  id: string;
}

export interface createMenuRequest {
  name: string;
  icon: string;
  url: string;
  route?: string;
  target?: string;
  sort?: number;
  type?: number;
  parentId?: string;
  status?: number;
}

export interface editMenuRequest {
  id: string;
  name: string;
  icon: string;
  url: string;
  route?: string;
  target?: string;
  sort?: number;
  type?: number;
  parentId?: string;
  status?: number;
}

export interface deleteMenuRequest {
  ids: string[];
}

export interface setMenuCodeRequest {
  id: string;
  code: string;
}

export interface bindMenuApisRequest {
  id: string;
  apiIds: string[];
}
