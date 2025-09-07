import { Options } from '@/api/common/request';
import { meRequest, editMyProfileRequest, editMyUsernameRequest, editMyAvatarRequest, sendMobileVerifiedCodeRequest, sendEmailVerifiedCodeRequest } from '@/api/me/request';
import {
  meResponse,
  editMyProfileResponse,
  editMyUsernameResponse,
  editMyAvatarResponse,
  sendEmailVerifiedCodeResponse, sendMobileVerifiedCodeResponse,
} from '@/api/me/response';
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

// editMyProfile 修改我的个人资料
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


// editMyAvatar 修改我的头像
export async function editMyAvatar(req?:editMyAvatarRequest,options?:Options) {
  return request<editMyAvatarResponse>({
    url: '/api/v1/me/avatar',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}


// editMyUsername 修改我的用户名
export async function editMyUsername(req?:editMyUsernameRequest,options?:Options) {
  return request<editMyUsernameResponse>({
    url: '/api/v1/me/username',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// sendEmailVerifiedCode 发送邮箱验证码
export async function sendEmailVerifiedCode(req?:sendEmailVerifiedCodeRequest,options?:Options) {
  return request<sendEmailVerifiedCodeResponse>({
    url: '/api/v1/me/email/verified/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// sendMobileVerifiedCode 发送手机验证码
export async function sendMobileVerifiedCode(req?:sendMobileVerifiedCodeRequest,options?:Options) {
  return request<sendMobileVerifiedCodeResponse>({
    url: '/api/v1/me/mobile/verified/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}
