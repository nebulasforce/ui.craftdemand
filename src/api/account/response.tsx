import { Pagination, Response, Result } from '@/api/common/response';
import { Account } from '@/api/account/typings';
import { User } from '@/api/my/typings';

export interface listData extends Pagination<User> {
}

export interface listResponse extends Response<listData> {}

export type listAllAccountData = Account[];

export interface listAllAccountResponse extends Response<listAllAccountData> {}

export interface createAccountData extends Result {
  id: string;
}

export interface createAccountResponse extends Response<createAccountData> {}

export interface deleteAccountData extends Result {
  count: number;
}

export interface deleteAccountResponse extends Response<deleteAccountData> {}

export interface editAccountData extends Result {
  id: string;
}

export interface editAccountResponse extends Response<editAccountData> {}

export type getAccountData = Account;

export interface getAccountResponse extends Response<getAccountData> {}
