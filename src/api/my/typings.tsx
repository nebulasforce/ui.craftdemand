export interface User {
  account: Account;
  profile: Profile;
}

export interface Account {
  id: string; // id
  username: string; // 用户名
  email: string; // 邮箱
  mobile: string; // 手机号
  status: number; // 状态
  lastLogin: number;
  active:number;
  wechat: string;
  alipay: string;
  qq: string;
  facebook: string;
  google: string;
  apple: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
}

export interface Profile {
  nickname: string;
  avatar: string;
  gender: number;
  signature: string;
  birthday: string;
  address: string;
  province: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
  deliveryAddress: Address[];
}

export interface Address {
  id: string;
  address: string;
  phone: string;
  receiver: string;
  isDefault: boolean;
}
