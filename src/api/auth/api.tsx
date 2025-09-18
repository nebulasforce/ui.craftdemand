import request from '@/utils/request';
import { loginRequest, registerRequest,logoutRequest,checkRequest } from '@/api/auth/request';
import { loginResponse, registerResponse,checkResponse } from '@/api/auth/response';
import { Options } from '@/api/common/request';

// login 登录
export async function login(req: loginRequest,options?:Options) {
  return request<loginResponse>({
    url: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req,
    ...(options || {}),
  });
}

// register 注册
export async function register(req: registerRequest,options?:Options) {
  return request<registerResponse>({
    url: '/api/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req,
    ...(options || {}),
  });
}

// logout  退出
export async function logout(req?: logoutRequest,options?:Options) {
  return request<loginResponse>({
    url: '/api/v1/auth/logout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req,
    ...(options || {}),
  });
}


// 检查用户注册状态
export async function check(req?:checkRequest,options?:Options) {
  return request<checkResponse>({
    url: `/api/v1/auth/check/register/status/${ req?.key}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:  {},
    ...(options || {}),
  });
}
