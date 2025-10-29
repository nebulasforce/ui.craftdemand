import { Options } from '@/api/common/request';
import { deleteMySubAccountRequest, editMyAvatarRequest, editMyEmailRequest, editMyMobileRequest, editMyPasswordRequest, editMyProfileRequest, editMyUsernameRequest, meRequest, myAllSubAccountListRequest, mySubAccountListRequest, myUnreadMessageCountRequest, sendEmailVerifiedCodeRequest, sendMobileVerifiedCodeRequest } from '@/api/my/request';
import { deleteMySubAccountResponse, editMyAvatarResponse, editMyEmailResponse, editMyMobileResponse, editMyPasswordResponse, editMyProfileResponse, editMyUsernameResponse, meResponse, myAllSubAccountListResponse, mySubAccountListResponse, myUnreadMessageCountResponse, sendEmailVerifiedCodeResponse, sendMobileVerifiedCodeResponse } from '@/api/my/response';
import request from '@/utils/request';


// me 获取个人信息
export async function me(req?:meRequest,options?:Options) {
  return request<meResponse>({
    url: '/api/v1/my/info',
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
    url: '/api/v1/my/profile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editMyProfile 修改我的个人资料
export async function editMyPassword(req?:editMyPasswordRequest,options?:Options) {
  return request<editMyPasswordResponse>({
    url: '/api/v1/my/password',
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
    url: '/api/v1/my/avatar',
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
    url: '/api/v1/my/username',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editMyEmail 修改我的邮箱
export async function editMyEmail(req?:editMyEmailRequest,options?:Options) {
  return request<editMyEmailResponse>({
    url: '/api/v1/my/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editMyMobile 修改我的邮箱
export async function editMyMobile(req?:editMyMobileRequest,options?:Options) {
  return request<editMyMobileResponse>({
    url: '/api/v1/my/mobile',
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
    url: '/api/v1/my/email/verified/code',
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
    url: '/api/v1/my/mobile/verified/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

//  mySubAccountList 获取个人子账号分页列表
export async function mySubAccountList(req?:mySubAccountListRequest,options?:Options) {
  return request<mySubAccountListResponse>({
    url: '/api/v1/my/sub-account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// myAllSubAccountList 获取全部子账号列表
export async function myAllSubAccountList(req?:myAllSubAccountListRequest,options?:Options) {
  return request<myAllSubAccountListResponse>({
    url: '/api/v1/my/all/sub-account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// myUnreadMessageCount 获取我的未读消息数量
export async function myUnreadMessageCount(req?: myUnreadMessageCountRequest, options?: Options) {
  return request<myUnreadMessageCountResponse>({
    url: '/api/v1/my/unread-message-count',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


// deleteMySubAccount 删除我的子账号
export async function deleteMySubAccount(req?:deleteMySubAccountRequest,options?:Options) {
  return request<deleteMySubAccountResponse>({
    url: '/api/v1/my/sub-account/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}
