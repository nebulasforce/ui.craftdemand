//  mySubAccountList 获取消息分页列表
import { Options } from '@/api/common/request';
import { listRequest } from '@/api/message/request';
import { listResponse } from '@/api/message/response';
import request from '@/utils/request';

//  list 获取消息列表
export async function list(req?:listRequest,options?:Options) {
  return request<listResponse>({
    url: '/api/v1/message',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


