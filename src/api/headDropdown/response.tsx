import {HeadDropdownWithOutId} from '@/api/headDropdown/typings';
import {Response} from '@/api/common/response';

export interface Item extends  HeadDropdownWithOutId{}

export interface listGroupData {
  [key: string]: Item[];
}

export interface listGroupResponse  extends  Response<listGroupData> {}
