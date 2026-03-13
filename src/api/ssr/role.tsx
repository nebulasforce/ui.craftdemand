import { Options } from '@/api/common/request';
import sRequest from '@/utils/sRequest';
import { listRequest } from '@/api/role/request';
import { listResponse } from '@/api/role/response';

// roleList 获取角色分页列表（服务端渲染）
export async function roleList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/role',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

