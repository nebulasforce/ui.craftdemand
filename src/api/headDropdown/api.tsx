import { listGroupRequest } from '@/api/headDropdown/request';
import { listGroupResponse } from '@/api/headDropdown/response';
import request from '@/utils/request';

// listFront
export async function listGroup(req?: listGroupRequest) {
  return request<listGroupResponse>({
    url: '/api/v1/head-dropdown/group',
    method: 'GET',
    ...(req || {}),
  });
}
