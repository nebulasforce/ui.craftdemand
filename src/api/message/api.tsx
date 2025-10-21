//  mySubAccountList 获取消息分页列表
import { Options } from '@/api/common/request';
import { messageListRequest } from '@/api/message/request';
import { messageListResponse } from '@/api/message/response';
import request from '@/utils/request';

//  messageList 获取消息列表
export async function messageList(req?:messageListRequest,options?:Options) {
  return request<messageListResponse>({
    url: '/api/v1/message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


