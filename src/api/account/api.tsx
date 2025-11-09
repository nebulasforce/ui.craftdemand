import { listRequest } from '@/api/message/request';
import { listResponse } from '@/api/message/response';
import request from '@/utils/request';

// listFront
export async function listFront(req?: listRequest) {
  return request<listResponse>({
    url: '/api/v1/message',
    method: 'GET',
    ...(req || {}),
  });
}
