// import { Query,Pager } from '@/api/common/request';
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

export interface editMyAvatarRequest {
  avatar: string;
}
