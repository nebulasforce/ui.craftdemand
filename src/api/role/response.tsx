import { Role } from '@/api/role/typings';
import { Pagination, Response, Result } from '@/api/common/response';

export interface listData extends Pagination<Role> {}

export interface listResponse extends Response<listData> {}

export type getRoleData = Role;

export interface getRoleResponse extends Response<getRoleData> {}

export interface createRoleData extends Result {
  id?: string;
}

export interface createRoleResponse extends Response<createRoleData> {}

export interface editRoleData extends Result {
  id?: string;
}

export interface editRoleResponse extends Response<editRoleData> {}

export interface deleteRoleData extends Result {
  count?: number;
}

export interface deleteRoleResponse extends Response<deleteRoleData> {}

export type listAllData = Role[];

export interface listAllResponse extends Response<listAllData> {}

