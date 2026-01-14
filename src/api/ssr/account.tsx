import { Options } from '@/api/common/request';
import { listRequest, listAllAccountRequest } from '@/api/account/request';
import { listResponse, listAllAccountResponse } from '@/api/account/response';
import sRequest from '@/utils/sRequest';

// list 获取账号列表（服务端渲染）
export async function list(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

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

