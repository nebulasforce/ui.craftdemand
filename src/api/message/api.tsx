import { Options } from '@/api/common/request';
import { 
  listRequest, 
  listAllRequest, 
  deleteMessageRequest, 
  editMessageRequest, 
  getMessageRequest, 
  createMessageRequest 
} from '@/api/message/request';
import { 
  listResponse, 
  listAllResponse, 
  deleteMessageResponse, 
  editMessageResponse, 
  getMessageResponse, 
  createMessageResponse 
} from '@/api/message/response';
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

// listAll 获取所有消息列表
export async function listAll(req?:listAllRequest,options?:Options) {
  return request<listAllResponse>({
    url: '/api/v1/message/all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}

// deleteMessage 删除消息
export async function deleteMessage(req?:deleteMessageRequest,options?:Options) {
  return request<deleteMessageResponse>({
    url: '/api/v1/message/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// editMessage 编辑消息
export async function editMessage(req?:editMessageRequest,options?:Options) {
  return request<editMessageResponse>({
    url: `/api/v1/message/${req?.id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// createMessage 创建消息
export async function createMessage(req?:createMessageRequest,options?:Options) {
  return request<createMessageResponse>({
    url: '/api/v1/message/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

// getMessage 获取消息详情
export async function getMessage(req?:getMessageRequest,options?:Options) {
  return request<getMessageResponse>({
    url: `/api/v1/message/${req?.id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}


