import { Pagination, Response } from '@/api/common/response';
import { Message } from '@/api/message/typings';

export interface messageListData extends Pagination<Message> {
}

export interface messageListResponse extends Response<messageListData> {}

