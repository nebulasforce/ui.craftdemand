import { Pagination, Response, Result } from '@/api/common/response';
import { Message } from '@/api/message/typings';

export interface listData extends Pagination<Message> {
}

export interface listResponse extends Response<listData> {}

export type listAllData = Message[];

export interface listAllResponse extends Response<listAllData> {}

export interface deleteMessageData extends Result {
  count: number;
}

export interface deleteMessageResponse extends Response<deleteMessageData> {}

export interface editMessageData extends Result {
  id: string;
}

export interface editMessageResponse extends Response<editMessageData> {}

export interface createMessageData extends Result {
  id: string;
}

export interface createMessageResponse extends Response<createMessageData> {}

export type getMessageData = Message;

export interface getMessageResponse extends Response<getMessageData> {}

export interface publishMessageData extends Result {
  id: string;
}

export interface publishMessageResponse extends Response<publishMessageData> {}

