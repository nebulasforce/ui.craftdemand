import { listGroupRequest } from '@/api/navbar/request';
import { listGroupResponse } from '@/api/navbar/response';
import request from '@/utils/request';

// listGroup
export async function listGroup(req?: listGroupRequest) {
  return request<listGroupResponse>({
    url: '/api/v1/navbar/group',
    method: 'GET',
    ...(req || {}),
  });
}
