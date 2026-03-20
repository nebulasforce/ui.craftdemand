import { Options } from '@/api/common/request';
import {
  createDepartmentRequest,
  deleteDepartmentRequest,
  editDepartmentRequest,
  getDepartmentRequest,
  listAllRequest,
  listRequest,
} from '@/api/department/request';
import {
  createDepartmentResponse,
  deleteDepartmentResponse,
  editDepartmentResponse,
  getDepartmentResponse,
  listAllResponse,
  listResponse,
} from '@/api/department/response';
import request from '@/utils/request';

// list 获取部门列表（分页，树形）
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/department',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// listAll 获取全部部门树
export async function listAll(req?: listAllRequest, options?: Options) {
  return request<listAllResponse>({
    url: '/api/v1/department/all',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// getDepartment 获取部门详情
export async function getDepartment(req?: getDepartmentRequest, options?: Options) {
  return request<getDepartmentResponse>({
    url: `/api/v1/department/${req?.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// createDepartment 创建部门
export async function createDepartment(req?: createDepartmentRequest, options?: Options) {
  return request<createDepartmentResponse>({
    url: '/api/v1/department/add',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// editDepartment 编辑部门
export async function editDepartment(req?: editDepartmentRequest, options?: Options) {
  return request<editDepartmentResponse>({
    url: `/api/v1/department/${req?.id}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// deleteDepartment 删除部门
export async function deleteDepartment(req?: deleteDepartmentRequest, options?: Options) {
  return request<deleteDepartmentResponse>({
    url: '/api/v1/department/delete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}
