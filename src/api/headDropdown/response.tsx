import { HeadDropdownWithOutId, HeadDropdown } from '@/api/headDropdown/typings';
import { Pagination, Response, Result } from '@/api/common/response';

export interface Item extends HeadDropdownWithOutId {}

export interface listGroupData {
  [key: string]: Item[];
}

export interface listGroupResponse extends Response<listGroupData> {}

export interface listData extends Pagination<HeadDropdown> {}

export interface listResponse extends Response<listData> {}

export type listAllData = HeadDropdown[];

export interface listAllResponse extends Response<listAllData> {}

export type getHeadDropdownData = HeadDropdown;

export interface getHeadDropdownResponse extends Response<getHeadDropdownData> {}

export interface createHeadDropdownData extends Result {
  id: string;
}

export interface createHeadDropdownResponse extends Response<createHeadDropdownData> {}

export interface editHeadDropdownData extends Result {
  id: string;
}

export interface editHeadDropdownResponse extends Response<editHeadDropdownData> {}

export interface deleteHeadDropdownData extends Result {
  count: number;
}

export interface deleteHeadDropdownResponse extends Response<deleteHeadDropdownData> {}

// 标签列表数据（返回字符串数组）
export type listLabelsData = string[];

export interface listLabelsResponse extends Response<listLabelsData> {}
