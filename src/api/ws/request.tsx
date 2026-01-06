import { Message } from '@/api/ws/typings';


export interface authenticateRequestData {
  token: string;
}

export interface authenticateRequest extends  Message<authenticateRequestData>{
}

// 订阅未读消息通知请求（可选，如果服务端需要客户端主动订阅）
export interface subscribeNotificationRequestData {
  // 可以添加订阅参数，如：订阅类型、过滤条件等
  // 当前为空对象，表示订阅所有通知
}

export interface subscribeNotificationRequest extends Message<subscribeNotificationRequestData> {
}
