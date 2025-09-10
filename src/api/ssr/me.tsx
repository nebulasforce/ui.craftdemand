import sRequest from '@/utils/sRequest';
import { meRequest } from '@/api/my/request';
import { Options } from '@/api/common/request';
import { meResponse } from '@/api/my/response';



export async function me(req?:meRequest,options?:Options) {
  return sRequest<meResponse>({
    url: '/api/v1/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}
