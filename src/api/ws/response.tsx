import { Message } from '@/api/ws/typings';


export interface authenticateResponseData {
  result: boolean;
  accountId: string;
}

export interface authenticateResponse extends  Message<authenticateResponseData>{
}
