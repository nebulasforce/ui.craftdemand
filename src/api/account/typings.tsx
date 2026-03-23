/** 账号 id + 用户名（用于下拉等轻量场景，如 GET /account/names） */
export interface AccountName {
  id: string | number;
  username?: string;
}

export interface Account {
  id: string; // id
  username: string; // 用户名
  email: string; // 邮箱
  mobile: string; // 手机号
  status: number; // 状态
  lastLogin?: number;
  active?: number;
  wechat?: string;
  alipay?: string;
  qq?: string;
  facebook?: string;
  google?: string;
  apple?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}
