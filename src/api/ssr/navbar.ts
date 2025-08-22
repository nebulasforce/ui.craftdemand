import { listGroupRequest } from '@/api/navbar/request';
import { listGroupResponse } from '@/api/navbar/response';
import sRequest from '@/utils/sRequest';

// listGroup 服务端渲染分组获取navbar数据
export async function listGroup(req?: listGroupRequest) {
  return sRequest<listGroupResponse>({
    url: '/api/v1/navbar/group',
    method: 'GET',
    ...(req || {}),
  });
}
