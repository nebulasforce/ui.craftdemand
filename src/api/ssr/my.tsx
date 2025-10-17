import { Options } from '@/api/common/request';
import { messageListRequest } from '@/api/message/request';
import { messageListResponse } from '@/api/message/response';
import { myInfoRequest, mySubAccountListRequest, myUnreadMessageCountRequest } from '@/api/my/request';
import { myInfoResponse, mySubAccountListResponse, myUnreadMessageCountResponse } from '@/api/my/response';
import sRequest from '@/utils/sRequest';


export async function myInfo(req?:myInfoRequest,options?:Options) {
  return sRequest<myInfoResponse>({
    url: '/api/v1/my/info',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

//  mySubAccountList 获取个人子账号分页列表
export async function mySubAccountList(req?:mySubAccountListRequest,options?:Options) {
  return sRequest<mySubAccountListResponse>({
    url: '/api/v1/my/sub-account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


export async function myCustomMessageList(req?:messageListRequest,options?:Options) {
  return sRequest<messageListResponse>({
    url: '/api/v1/my/custom-message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getUnreadCount
export async function myUnreadMessageCount(req?:myUnreadMessageCountRequest,options?:Options) {
  return sRequest<myUnreadMessageCountResponse>({
    url: '/api/v1/my/unread-message-count',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}
