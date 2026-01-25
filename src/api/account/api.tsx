import { Options } from '@/api/common/request';
import { listRequest, listAllAccountRequest, createAccountRequest, deleteAccountRequest, editAccountRequest, getAccountRequest, resetAccountPasswordRequest } from '@/api/account/request';
import { listResponse, listAllAccountResponse, createAccountResponse, deleteAccountResponse, editAccountResponse, getAccountResponse, resetAccountPasswordResponse } from '@/api/account/response';
import request from '@/utils/request';

// list 获取账号列表
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// listAllAccount 获取所有账号列表
export async function listAllAccount(req?: listAllAccountRequest, options?: Options) {
  return request<listAllAccountResponse>({
    url: '/api/v1/account/list',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// createAccount 创建账号
export async function createAccount(req?: createAccountRequest, options?: Options) {
  return request<createAccountResponse>({
    url: '/api/v1/account/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// deleteAccount 删除账号
export async function deleteAccount(req?: deleteAccountRequest, options?: Options) {
  return request<deleteAccountResponse>({
    url: '/api/v1/account/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editAccount 编辑账号
export async function editAccount(req?: editAccountRequest, options?: Options) {
  return request<editAccountResponse>({
    url: `/api/v1/account/${req?.id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// getAccount 获取账号详情
export async function getAccount(req?: getAccountRequest, options?: Options) {
  return request<getAccountResponse>({
    url: `/api/v1/account/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// resetAccountPassword 重置账号密码
export async function resetAccountPassword(req?: resetAccountPasswordRequest, options?: Options) {
  return request<resetAccountPasswordResponse>({
    url: `/api/v1/account/${req?.id}/password`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req ? { password: req.password } : {},
    ...(options || {}),
  });
}
