import { listFrontRequest } from '@/api/menu/request';
import { listFrontResponse } from '@/api/menu/response';
import request from '@/utils/request';

// listFront
export async function listFront(req: listFrontRequest) {
  return request<listFrontResponse>({
    url: '/api/v1/menu/front',
    method: 'GET',
    ...(req || {}),
  });
}
