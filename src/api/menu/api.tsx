import { listFrontRequest } from '@/api/menu/request';
import { listFrontResponse } from '@/api/menu/response';
// import { request } from '@umijs/max';
export async function listFront(req: listFrontRequest) {
  return request<listFrontResponse>('/api/v1/menu/front', {
    method: 'GET',
    ...(req || {}),
  });
}
