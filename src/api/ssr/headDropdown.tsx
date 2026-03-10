import { Options } from '@/api/common/request';
import { listGroupRequest } from '@/api/headDropdown/request';
import { listGroupResponse } from '@/api/headDropdown/response';
import sRequest from '@/utils/sRequest';

// listGroup 获取头部下拉分组数据（服务端渲染）
export async function listGroup(req?: listGroupRequest, options?: Options) {
  return sRequest<listGroupResponse>({
    url: '/api/v1/head-dropdown/group',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

