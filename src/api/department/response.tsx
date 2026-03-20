import { Department } from '@/api/department/typings';
import { Pagination, Response, Result } from '@/api/common/response';

export interface listData extends Pagination<Department> {}

export interface listResponse extends Response<listData> {}

export type getDepartmentData = Department;

export interface getDepartmentResponse extends Response<getDepartmentData> {}

export interface createDepartmentData extends Result {
  id?: string;
}

export interface createDepartmentResponse extends Response<createDepartmentData> {}

export interface editDepartmentData extends Result {
  id?: string;
}

export interface editDepartmentResponse extends Response<editDepartmentData> {}

export interface deleteDepartmentData extends Result {
  count?: number;
}

export interface deleteDepartmentResponse extends Response<deleteDepartmentData> {}

export type listAllData = Department[];

export interface listAllResponse extends Response<listAllData> {}
