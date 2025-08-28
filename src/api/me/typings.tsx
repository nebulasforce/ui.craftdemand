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
  name: string;
  avatar: string;
  signature: string;
  birthday: string;
  address: string;
  province: {
    code: string;
    name: string;
  };
  city: {
    code: string;
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
