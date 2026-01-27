import { Options } from '@/api/common/request';
import { listRequest } from '@/api/message/request';
import { listResponse } from '@/api/message/response';
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


export async function myCustomMessageList(req?:listRequest,options?:Options) {
  return sRequest<listResponse>({
    url: '/api/v1/my/custom-message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// mySystemMessageList 获取系统消息列表
export async function mySystemMessageList(req?:listRequest,options?:Options) {
  return sRequest<listResponse>({
    url: '/api/v1/my/system-message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// mySentMessageList 获取发送的消息列表
export async function mySentMessageList(req?:listRequest,options?:Options) {
  return sRequest<listResponse>({
    url: '/api/v1/my/sent-message',
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
