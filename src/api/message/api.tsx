//  mySubAccountList 获取消息分页列表
import { messageListRequest } from '@/api/message/request';
import { Options } from '@/api/common/request';
import request from '@/utils/request';
import { messageListResponse } from '@/api/message/response';

//  messageList 获取个人子账号分页列表
export async function messageList(req?:messageListRequest,options?:Options) {
  return request<messageListResponse>({
    url: '/api/v1/my/sub-account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}
