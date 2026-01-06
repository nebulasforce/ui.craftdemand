import { Message } from '@/api/ws/typings';


export interface authenticateResponseData {
  result: boolean; // 结果
  accountId: string; // 账号id
  expires: number; // 过期时间
}

export interface authenticateResponse extends  Message<authenticateResponseData>{
}

// 未读消息通知响应数据
export interface notificationResponseData {
  count: number; // 未读消息数量
  timestamp?: number; // 时间戳（可选，用于调试）
  // 可以扩展其他字段，如：
  // messageId?: string; // 最新消息ID
  // lastMessageTime?: number; // 最新消息时间
}

// 未读消息通知响应（服务端主动推送）
export interface notificationResponse extends Message<notificationResponseData> {
}
