import { Options } from '@/api/common/request';
import { listRequest, listAllRequest, getMessageRequest } from '@/api/message/request';
import { listResponse, listAllResponse, getMessageResponse } from '@/api/message/response';
import sRequest from '@/utils/sRequest';


// messageList 获取消息分页列表（服务端渲染）
export async function messageList(req?: listRequest, options?: Options) {
  return sRequest<listResponse>({
    url: '/api/v1/message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// messageListAll 获取所有消息列表（服务端渲染）
export async function messageListAll(req?: listAllRequest, options?: Options) {
  return sRequest<listAllResponse>({
    url: '/api/v1/message/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// getMessage 获取消息详情（服务端渲染）
export async function getMessage(req?: getMessageRequest, options?: Options) {
  return sRequest<getMessageResponse>({
    url: `/api/v1/message/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


