import { Options } from '@/api/common/request';
import { listRequest, listAllRequest, listGroupRequest, getNavbarRequest, listLabelsRequest } from '@/api/navbar/request';
import { listResponse, listAllResponse, listGroupResponse, getNavbarResponse, listLabelsResponse } from '@/api/navbar/response';
import sRequest from '@/utils/sRequest';

// navbarList 获取导航栏分页列表（服务端渲染）
export async function navbarList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/navbar',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// navbarListAll 获取所有导航栏列表（服务端渲染）
export async function navbarListAll(req?: listAllRequest, options?: Options) {
  return sRequest<listAllResponse>({
    url: '/api/v1/navbar/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listGroup 服务端渲染分组获取navbar数据
export async function listGroup(req?: listGroupRequest, options?: Options) {
  return sRequest<listGroupResponse>({
    url: '/api/v1/navbar/group',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getNavbar 获取导航栏详情（服务端渲染）
export async function getNavbar(req?: getNavbarRequest, options?: Options) {
  return sRequest<getNavbarResponse>({
    url: `/api/v1/navbar/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// navbarListLabels 获取标签列表（服务端渲染）
export async function navbarListLabels(req?: listLabelsRequest, options?: Options) {
  return sRequest<listLabelsResponse>({
    url: '/api/v1/navbar/labels',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}
