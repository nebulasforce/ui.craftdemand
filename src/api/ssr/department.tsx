import { Options } from '@/api/common/request';
import sRequest from '@/utils/sRequest';
import { listRequest } from '@/api/department/request';
import { listResponse } from '@/api/department/response';

// departmentList 获取部门分页列表（服务端渲染）
export async function departmentList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/department',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}
