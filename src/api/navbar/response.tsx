import { NavbarWithOutId, Navbar } from '@/api/navbar/typings';
import { Response, Pagination, Result } from '@/api/common/response';

export interface Item extends NavbarWithOutId {}

export interface listGroupData {
  [key: string]: Item[];
}

export interface listGroupResponse extends Response<listGroupData> {}

export interface listData extends Pagination<Navbar> {}

export interface listResponse extends Response<listData> {}

export type listAllData = Navbar[];

export interface listAllResponse extends Response<listAllData> {}

export type getNavbarData = Navbar;

export interface getNavbarResponse extends Response<getNavbarData> {}

export interface createNavbarData extends Result {
  id: string;
}

export interface createNavbarResponse extends Response<createNavbarData> {}

export interface editNavbarData extends Result {
  id: string;
}

export interface editNavbarResponse extends Response<editNavbarData> {}

export interface deleteNavbarData extends Result {
  count: number;
}

export interface deleteNavbarResponse extends Response<deleteNavbarData> {}

// 标签列表数据（返回字符串数组）
export type listLabelsData = string[];

export interface listLabelsResponse extends Response<listLabelsData> {}
