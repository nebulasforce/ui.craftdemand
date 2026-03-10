import { Options } from '@/api/common/request';
import {
  listRequest,
  listAllRequest,
  getApiRequest,
  createApiRequest,
  editApiRequest,
  deleteApiRequest,
} from '@/api/api/request';
import {
  listResponse,
  listAllResponse,
  getApiResponse,
  createApiResponse,
  editApiResponse,
  deleteApiResponse,
} from '@/api/api/response';
import request from '@/utils/request';

// list 获取API列表
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/api',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listAll 获取所有API列表
export async function listAll(req?: listAllRequest, options?: Options) {
  return request<listAllResponse>({
    url: '/api/v1/api/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getApi 获取API详情
export async function getApi(req?: getApiRequest, options?: Options) {
  return request<getApiResponse>({
    url: `/api/v1/api/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// createApi 创建API
export async function createApi(req?: createApiRequest, options?: Options) {
  return request<createApiResponse>({
    url: '/api/v1/api/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editApi 编辑API
export async function editApi(req?: editApiRequest, options?: Options) {
  return request<editApiResponse>({
    url: `/api/v1/api/${req?.id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// deleteApi 删除API
export async function deleteApi(req?: deleteApiRequest, options?: Options) {
  return request<deleteApiResponse>({
    url: '/api/v1/api/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}
