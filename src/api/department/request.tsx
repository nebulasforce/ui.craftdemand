import { Pager, Query } from '@/api/common/request';

export interface listRequest extends Query, Pager {}

export interface getDepartmentRequest extends Query {
  id: string;
}

export interface createDepartmentRequest {
  name: string;
  code?: string;
  /** 负责人账号 ID */
  managerId?: string;
  parentId?: string;
  sort?: number;
  status?: number;
}

export interface editDepartmentRequest extends createDepartmentRequest {
  id: string;
}

export interface deleteDepartmentRequest {
  ids: string[];
}

export interface listAllRequest extends Query {}
