import { Options } from '@/api/common/request';
import { listAllAccountRequest } from '@/api/account/request';
import { listAllAccountResponse } from '@/api/account/response';
import sRequest from '@/utils/sRequest';

// listAllAccount 获取所有账号列表（服务端渲染）
export async function listAllAccount(req?: listAllAccountRequest, options?: Options) {
  return sRequest<listAllAccountResponse>({
    url: '/api/v1/account/list',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

