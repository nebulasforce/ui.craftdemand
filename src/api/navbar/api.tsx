import { Options } from '@/api/common/request';
import {
  listRequest,
  listAllRequest,
  listGroupRequest,
  getNavbarRequest,
  createNavbarRequest,
  editNavbarRequest,
  deleteNavbarRequest,
  listLabelsRequest,
} from '@/api/navbar/request';
import {
  listResponse,
  listAllResponse,
  listGroupResponse,
  getNavbarResponse,
  createNavbarResponse,
  editNavbarResponse,
  deleteNavbarResponse,
  listLabelsResponse,
} from '@/api/navbar/response';
import request from '@/utils/request';

// list 获取导航栏列表
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/navbar',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listAll 获取所有导航栏列表
export async function listAll(req?: listAllRequest, options?: Options) {
  return request<listAllResponse>({
    url: '/api/v1/navbar/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listGroup 分组获取navbar
export async function listGroup(req?: listGroupRequest, options?: Options) {
  return request<listGroupResponse>({
    url: '/api/v1/navbar/group',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getNavbar 获取导航栏详情
export async function getNavbar(req?: getNavbarRequest, options?: Options) {
  return request<getNavbarResponse>({
    url: `/api/v1/navbar/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// createNavbar 创建导航栏
export async function createNavbar(req?: createNavbarRequest, options?: Options) {
  return request<createNavbarResponse>({
    url: '/api/v1/navbar/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editNavbar 编辑导航栏
export async function editNavbar(req?: editNavbarRequest, options?: Options) {
  return request<editNavbarResponse>({
    url: `/api/v1/navbar/${req?.id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// deleteNavbar 删除导航栏
export async function deleteNavbar(req?: deleteNavbarRequest, options?: Options) {
  return request<deleteNavbarResponse>({
    url: '/api/v1/navbar/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// listLabels 获取标签列表
export async function listLabels(req?: listLabelsRequest, options?: Options) {
  return request<listLabelsResponse>({
    url: '/api/v1/navbar/labels',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

