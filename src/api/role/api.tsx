import { Options } from '@/api/common/request';
import {
  createRoleRequest,
  deleteRoleRequest,
  editRoleRequest,
  getRoleRequest,
  listAllRequest,
  listRequest,
} from '@/api/role/request';
import {
  createRoleResponse,
  deleteRoleResponse,
  editRoleResponse,
  getRoleResponse,
  listAllResponse,
  listResponse,
} from '@/api/role/response';
import request from '@/utils/request';

// list 获取角色列表（分页，树形）
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/role',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// listAll 获取全部角色树
export async function listAll(req?: listAllRequest, options?: Options) {
  return request<listAllResponse>({
    url: '/api/v1/role/all',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// getRole 获取角色详情
export async function getRole(req?: getRoleRequest, options?: Options) {
  return request<getRoleResponse>({
    url: `/api/v1/role/${req?.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// createRole 创建角色
export async function createRole(req?: createRoleRequest, options?: Options) {
  return request<createRoleResponse>({
    url: '/api/v1/role/add',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// editRole 编辑角色
export async function editRole(req?: editRoleRequest, options?: Options) {
  return request<editRoleResponse>({
    url: `/api/v1/role/${req?.id}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// deleteRole 删除角色
export async function deleteRole(req?: deleteRoleRequest, options?: Options) {
  return request<deleteRoleResponse>({
    url: '/api/v1/role/delete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

