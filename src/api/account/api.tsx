import { listRequest, listAllAccountRequest } from '@/api/account/request';
import { listResponse, listAllAccountResponse } from '@/api/account/response';
import request from '@/utils/request';

// list 获取账号列表
export async function list(req?: listRequest) {
  return request<listResponse>({
    url: '/api/v1/account',
    method: 'GET',
    ...(req || {}),
  });
}

// listAllAccount 获取所有账号列表
export async function listAllAccount(req?: listAllAccountRequest) {
  return request<listAllAccountResponse>({
    url: '/api/v1/account/list',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
  });
}
