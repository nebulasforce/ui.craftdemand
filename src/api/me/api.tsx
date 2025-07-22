import request from '@/utils/request';
import { meRequest } from '@/api/me/request';
import { meResponse } from '@/api/me/response';
import { Options } from '@/api/common/request';

// me 获取个人信息
export async function me(req?:meRequest,options?:Options) {
  return request<meResponse>({
    url: '/api/v1/me',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}


