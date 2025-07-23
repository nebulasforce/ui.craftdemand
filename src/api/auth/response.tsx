import {Response,Result} from '@/api/common/response';

export interface Token extends Result {
  accessToken: string;
}

export interface loginResponse extends  Response<Token>{
  accessToken: string;
}

export interface logoutResponse extends Response<any> {
}

export interface registerResponse  extends  Response<Result> {}
