import { Query,Pager } from '@/api/common/request';


export interface listRequest extends Query,Pager {}

export interface listAllAccountRequest extends Query {}

export interface createAccountRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
  status: number;
}

export interface deleteAccountRequest {
  ids: string[];
}

export interface editAccountRequest {
  id: string;
  username: string;
  email: string;
  mobile: string;
  status: number;
}

export interface getAccountRequest extends Query {
  id: string;
}

export interface resetAccountPasswordRequest {
  id: string;
  password: string;
}
