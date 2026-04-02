import { MenuSummary } from '@/api/menu/typings';
import { Response, Pagination, Result } from '@/api/common/response';
import { Menu } from '@/api/menu/typings';

export interface frontItem extends MenuSummary {}

export interface listFrontData {
  headings: frontItem[];
  subheadings: frontItem[];
}

export interface listFrontResponse extends Response<listFrontData> {}

export interface menuTypeMapData {
  [key: string]: string;
}

export interface listData extends Pagination<Menu> {}

export interface listResponse extends Response<listData> {}

export type getMenuData = Menu;

export interface getMenuResponse extends Response<getMenuData> {}

export interface createMenuData extends Result {
  id?: string;
}

export interface createMenuResponse extends Response<createMenuData> {}

export interface editMenuData extends Result {
  id?: string;
}

export interface editMenuResponse extends Response<editMenuData> {}

export interface deleteMenuData extends Result {
  count?: number;
}

export interface deleteMenuResponse extends Response<deleteMenuData> {}

export interface listMenuTypesResponse extends Response<menuTypeMapData> {}

export interface setMenuCodeData extends Result {
  id?: string;
}

export interface setMenuCodeResponse extends Response<setMenuCodeData> {}

export interface bindMenuApisData extends Result {
  menuId?: string;
  apiIds?: string[];
}

export interface bindMenuApisResponse extends Response<bindMenuApisData> {}
