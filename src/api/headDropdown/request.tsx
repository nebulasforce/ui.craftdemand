import { Query, Pager } from '@/api/common/request';

export interface listRequest extends Query, Pager {}

export interface listAllRequest extends Query {}

export interface listGroupRequest extends Query, Pager {}

export interface getHeadDropdownRequest extends Query {
  id: string;
}

export interface createHeadDropdownRequest {
  name: string;
  code: string;
  icon: string;
  url: string;
  section: string;
  color?: string;
  event?: string;
  rightSection?: string;
  label?: string;
  sort?: number;
}

export interface editHeadDropdownRequest {
  id: string;
  name: string;
  code: string;
  icon: string;
  url: string;
  section: string;
  color?: string;
  event?: string;
  rightSection?: string;
  label?: string;
  sort?: number;
}

export interface deleteHeadDropdownRequest {
  ids: string[];
}

export interface listLabelsRequest extends Query {}
