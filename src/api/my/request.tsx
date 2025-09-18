import { Query,Pager } from '@/api/common/request';

export interface loginRequest {
  loginId: string;
  password?: string;
  captcha?: string;
  authCode?: string;
}

export interface registerRequest {
  mobile: string;
  email: string;
  password: string;
  captcha?: string;
  authCode?: string;
}

export interface meRequest {}

export interface myInfoRequest {}

export interface editMyProfileRequest {
  nickname: string;
  signature: string;
  address: string;
  avatar: string;
  birthday: string;
  city: {
    id: string;
    name: string;
  },
  province: {
    id: string;
    name: string;
  }
}

export interface editMyUsernameRequest {
  username: string;
}

export interface editMyEmailRequest {
  email: string;
  authCode: string;
}

export interface editMyMobileRequest {
  mobile: string;
  authCode: string;
}

export interface editMyAvatarRequest {
  avatar: string;
}

export interface sendEmailVerifiedCodeRequest {
  email: string;
}

export interface sendMobileVerifiedCodeRequest {
  mobile: string;
}

export interface editMyPasswordRequest {
  password: string; // 新密码
  confirmPassword: string; // 确认密码
  currentPassword: string; // 当前密码
}

export interface mySubAccountListRequest extends Query,Pager {}

export interface myAllSubAccountListRequest extends Query {}
