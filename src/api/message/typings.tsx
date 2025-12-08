export interface Creator {
  username: string; // 用户名
  nickname: string; // 昵称
}

export interface Updater {
  username: string; // 用户名
  nickname: string; // 昵称
}

export interface Message {
  id: string; // id
  title: string; // 标题
  type: number; // 类型
  content: string; // 内容
  status: number; // 状态
  creator?: Creator; // 创建者
  createdAt?: number; // 创建时间
  updater?: Updater; // 更新者
  updatedAt?: number; // 更新时间
  accountMessages?: any[]; // 账户消息列表（可选）
}
