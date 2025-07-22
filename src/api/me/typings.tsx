export interface AccountMe {
  account:Account;
  profile?:Profile;
}

export interface Account {
  id: string; // id
  username: string; // 用户名
  name?: string; // 昵称
  email: string; // 邮箱
  mobile: string; // 手机号
  status: number; // 状态
  avatar?: string; // 头像
}

export interface Profile {
  name: string;
  avatar: string;
}
