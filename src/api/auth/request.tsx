// import { Query,Pager } from '@/api/common/request';
export interface loginRequest {
  loginId: string;
  password?: string;
  captcha?: string;
  authCode?: string;
}

export interface logoutRequest {}

export interface registerRequest {
  mobile: string;
  email: string;
  password: string;
  captcha?: string;
  authCode?: string;
}

