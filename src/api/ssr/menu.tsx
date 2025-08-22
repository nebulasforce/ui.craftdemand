import sRequest from '@/utils/sRequest';
import { listFrontRequest } from '@/api/menu/request';
import { listFrontResponse } from '@/api/menu/response';

export async function listFront(req?: listFrontRequest) {
  return sRequest<listFrontResponse>({
    url: '/api/v1/menu/front',
    method: 'GET',
    ...(req || {}),
  });
}
