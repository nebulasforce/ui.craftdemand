import request from '@/utils/request';
import { loginRequest, registerRequest } from '@/api/auth/request';
import { loginResponse, registerResponse } from '@/api/auth/response';
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


