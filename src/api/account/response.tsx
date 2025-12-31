import { Pagination, Response } from '@/api/common/response';
import { Account } from '@/api/account/typings';

export interface listData extends Pagination<Account> {
}

export interface listResponse extends Response<listData> {}

export type listAllAccountData = Account[];

export interface listAllAccountResponse extends Response<listAllAccountData> {}

