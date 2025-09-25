import { Message } from '@/api/ws/typings';


export interface authenticateResponseData {
  result: boolean;
}

export interface authenticateResponse extends  Message<authenticateResponseData>{
}
