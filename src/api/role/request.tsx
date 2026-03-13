import { Pager, Query } from '@/api/common/request';

export interface listRequest extends Query, Pager {}

export interface getRoleRequest extends Query {
  id: string;
}

export interface createRoleRequest {
  name: string;
  parentId?: string;
  sort?: number;
  status?: number;
}

export interface editRoleRequest extends createRoleRequest {
  id: string;
}

export interface deleteRoleRequest {
  ids: string[];
}

export interface listAllRequest extends Query {}

