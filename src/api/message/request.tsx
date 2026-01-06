import { Pager, Query } from '@/api/common/request';


export interface listRequest extends Query,Pager {}

export interface listAllRequest extends Query {}

export interface deleteMessageRequest {
  ids: string[];
}

export interface editMessageRequest {
  id: string;
  title: string;
  content: string;
  status: number;
  type: number;
  accountIds?: string[];
}

export interface getMessageRequest extends Query {
  id: string;
}

export interface createMessageRequest {
  title: string;
  content: string;
  status: number;
  type: number;
  accountIds?: string[];
}

export interface publishMessageRequest {
  id: string;
}
