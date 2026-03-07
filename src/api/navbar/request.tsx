import { Query, Pager } from '@/api/common/request';

export interface listRequest extends Query, Pager {}

export interface listAllRequest extends Query {}

export interface listGroupRequest extends Query, Pager {}

export interface getNavbarRequest extends Query {
  id: string;
}

export interface createNavbarRequest {
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
  status?: number;
}

export interface editNavbarRequest {
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
  status?: number;
}

export interface deleteNavbarRequest {
  ids: string[];
}

export interface listLabelsRequest extends Query {}
