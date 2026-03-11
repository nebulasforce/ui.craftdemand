import { Options } from '@/api/common/request';
import {
  listRequest,
  listAllRequest,
  listGroupRequest,
  getHeadDropdownRequest,
  createHeadDropdownRequest,
  editHeadDropdownRequest,
  deleteHeadDropdownRequest,
  listLabelsRequest,
} from '@/api/headDropdown/request';
import {
  listResponse,
  listAllResponse,
  listGroupResponse,
  getHeadDropdownResponse,
  createHeadDropdownResponse,
  editHeadDropdownResponse,
  deleteHeadDropdownResponse,
  listLabelsResponse,
} from '@/api/headDropdown/response';
import request from '@/utils/request';

// list 获取头部下拉列表
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/head-dropdown',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listAll 获取所有头部下拉列表
export async function listAll(req?: listAllRequest, options?: Options) {
  return request<listAllResponse>({
    url: '/api/v1/head-dropdown/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listGroup 分组获取头部下拉
export async function listGroup(req?: listGroupRequest, options?: Options) {
  return request<listGroupResponse>({
    url: '/api/v1/head-dropdown/group',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getHeadDropdown 获取头部下拉详情
export async function getHeadDropdown(req?: getHeadDropdownRequest, options?: Options) {
  return request<getHeadDropdownResponse>({
    url: `/api/v1/head-dropdown/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// createHeadDropdown 创建头部下拉
export async function createHeadDropdown(req?: createHeadDropdownRequest, options?: Options) {
  return request<createHeadDropdownResponse>({
    url: '/api/v1/head-dropdown/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editHeadDropdown 编辑头部下拉
export async function editHeadDropdown(req?: editHeadDropdownRequest, options?: Options) {
  return request<editHeadDropdownResponse>({
    url: `/api/v1/head-dropdown/${req?.id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// deleteHeadDropdown 删除头部下拉
export async function deleteHeadDropdown(req?: deleteHeadDropdownRequest, options?: Options) {
  return request<deleteHeadDropdownResponse>({
    url: '/api/v1/head-dropdown/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// listLabels 获取标签列表（如果后端支持）
export async function listLabels(req?: listLabelsRequest, options?: Options) {
  return request<listLabelsResponse>({
    url: '/api/v1/head-dropdown/labels',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}
