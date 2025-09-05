import {Response,Result} from '@/api/common/response';

export interface Token {
  accessToken: string;
}

export interface loginResponse extends  Response<Token>{
}

export interface logoutResponse extends Response<any> {
}

export interface registerResponse  extends  Response<Result> {}

export interface checkResponse extends  Response<Result & {registerAble: boolean;}> {

}
