import { Message } from '@/api/ws/typings';


export interface authenticateRequestData {
  token: string;
}

export interface authenticateRequest extends  Message<authenticateRequestData>{
}
