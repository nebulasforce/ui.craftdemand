import { Options } from '@/api/common/request';
import { messageListRequest } from '@/api/message/request';
import { messageListResponse } from '@/api/message/response';
import sRequest from '@/utils/sRequest';


export async function messageList(req?: messageListRequest, options?: Options) {
  return sRequest<messageListResponse>({
    url: '/api/v1/message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


