import { Options } from '@/api/common/request';
import { meRequest,editMyProfileRequest } from '@/api/me/request';
import { meResponse,editMyProfileResponse } from '@/api/me/response';
import request from '@/utils/request';


// me 获取个人信息
export async function me(req?:meRequest,options?:Options) {
  return request<meResponse>({
    url: '/api/v1/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editMeProfile 修改我的个人资料

export async function editMyProfile(req?:editMyProfileRequest,options?:Options) {
  return request<editMyProfileResponse>({
    url: '/api/v1/me/profile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}
