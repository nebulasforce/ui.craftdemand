import { getPublicKeyRequest } from '@/api/data/request';
import { getPublicKeyResponse } from '@/api/data/response';
import request from '@/utils/request';

// listFront
export async function getPublicKey(req?: getPublicKeyRequest) {
  return request<getPublicKeyResponse>({
    url: '/api/v1/data/public-key',
    method: 'GET',
    ...(req || {}),
  });
}
