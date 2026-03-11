import { Options } from '@/api/common/request';
import sRequest from '@/utils/sRequest';
import { listFrontRequest, listRequest } from '@/api/menu/request';
import { listFrontResponse, listResponse } from '@/api/menu/response';

export async function listFront(req?: listFrontRequest, options?: Options) {
  return sRequest<listFrontResponse>({
    url: '/api/v1/menu/front',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// menuList 获取菜单分页列表（服务端渲染）
export async function menuList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/menu',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}
