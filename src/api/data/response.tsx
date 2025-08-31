import {Response} from '@/api/common/response';
import {ProvinceItem, CityItem} from '@/api/data/typings';

export type getPublicKeyData = string

export interface getPublicKeyResponse  extends  Response<getPublicKeyData> {}


export type getProvincesData = ProvinceItem[];
export interface getProvincesResponse extends Response<getProvincesData> {}


export interface getCitiesData {
  [provinceCode: string]: CityItem[];
}
export interface getCitiesResponse extends Response<getCitiesData> {}
