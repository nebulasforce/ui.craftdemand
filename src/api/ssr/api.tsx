import { Options } from '@/api/common/request';
import { listRequest, listAllRequest, getApiRequest } from '@/api/api/request';
import { listResponse, listAllResponse, getApiResponse } from '@/api/api/response';
import { Response } from '@/api/common/response';
import sRequest from '@/utils/sRequest';

// apiList 获取API分页列表（服务端渲染）
export async function apiList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/api',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// apiListAll 获取所有API列表（服务端渲染）
export async function apiListAll(req?: listAllRequest, options?: Options) {
  return sRequest<listAllResponse>({
    url: '/api/v1/api/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getApi 获取API详情（服务端渲染）
export async function getApi(req?: getApiRequest, options?: Options) {
  return sRequest<getApiResponse>({
    url: `/api/v1/api/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// apiModules 获取模块列表（服务端渲染）
export interface ApiModuleItem {
  name: string;
}

export type ApiModulesResponse = Response<ApiModuleItem[]>;

export async function apiModules(options?: Options) {
  return sRequest<ApiModulesResponse>({
    url: '/api/v1/api/modules',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
