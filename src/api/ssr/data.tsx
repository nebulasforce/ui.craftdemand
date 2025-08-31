import { getPublicKeyRequest,getProvincesRequest,getCitiesRequest } from '@/api/data/request';
import { getPublicKeyResponse ,getProvincesResponse,getCitiesResponse} from '@/api/data/response';
import sRequest from '@/utils/sRequest';

// listFront
export async function getPublicKey(req?: getPublicKeyRequest) {
  return sRequest<getPublicKeyResponse>({
    url: '/api/v1/data/public-key',
    method: 'GET',
    ...(req || {}),
  });
}

// getProvinces 获取省份列表
export async function getProvinces(req?: getProvincesRequest) {
  return sRequest<getProvincesResponse>({
    url: '/api/v1/data/provinces',
    method: 'GET',
    ...(req || {}),
  });
}

// getCities 获取城市列表
export async function getCities(req?: getCitiesRequest) {
  return sRequest<getCitiesResponse>({
    url: '/api/v1/data/cities',
    method: 'GET',
    ...(req || {}),
  });
}
