import {NavbarWithOutId} from '@/api/navbar/typings';
import {Response} from '@/api/common/response';

export interface Item extends  NavbarWithOutId{}

export interface listGroupData {
  [key: string]: Item[];
}

export interface listGroupResponse  extends  Response<listGroupData> {}
