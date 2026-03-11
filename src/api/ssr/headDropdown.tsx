import { Options } from '@/api/common/request';
import {
  listRequest,
  listAllRequest,
  listGroupRequest,
  getHeadDropdownRequest,
  listLabelsRequest,
} from '@/api/headDropdown/request';
import {
  listResponse,
  listAllResponse,
  listGroupResponse,
  getHeadDropdownResponse,
  listLabelsResponse,
} from '@/api/headDropdown/response';
import sRequest from '@/utils/sRequest';

// headDropdownList 获取头部下拉分页列表（服务端渲染）
export async function headDropdownList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/head-dropdown',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// headDropdownListAll 获取所有头部下拉列表（服务端渲染）
export async function headDropdownListAll(req?: listAllRequest, options?: Options) {
  return sRequest<listAllResponse>({
    url: '/api/v1/head-dropdown/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listGroup 获取头部下拉分组数据（服务端渲染）
export async function listGroup(req?: listGroupRequest, options?: Options) {
  return sRequest<listGroupResponse>({
    url: '/api/v1/head-dropdown/group',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getHeadDropdown 获取头部下拉详情（服务端渲染）
export async function getHeadDropdown(req?: getHeadDropdownRequest, options?: Options) {
  return sRequest<getHeadDropdownResponse>({
    url: `/api/v1/head-dropdown/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// headDropdownListLabels 获取标签列表（服务端渲染，如后端支持）
export async function headDropdownListLabels(req?: listLabelsRequest, options?: Options) {
  return sRequest<listLabelsResponse>({
    url: '/api/v1/head-dropdown/labels',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

