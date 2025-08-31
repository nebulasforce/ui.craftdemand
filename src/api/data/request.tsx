import { Query,Pager } from '@/api/common/request';

export interface getPublicKeyRequest extends Query,Pager{}

// 新增省份列表请求接口（如果需要分页或查询参数）
export interface getProvincesRequest extends Query {}

export interface getCitiesRequest extends Query {
  code?: number;
}
