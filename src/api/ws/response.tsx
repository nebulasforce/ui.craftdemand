import { Message } from '@/api/ws/typings';


export interface authenticateResponseData {
  result: boolean; // 结果
  accountId: string; // 账号id
  expires: number; // 过期时间
}

export interface authenticateResponse extends  Message<authenticateResponseData>{
}
