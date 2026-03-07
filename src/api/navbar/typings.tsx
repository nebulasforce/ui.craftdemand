export interface Creator {
  username: string;
  nickname: string;
}

export interface Updater {
  username: string;
  nickname: string;
}

export interface NavbarWithOutId {
  name: string;
  code: string;
  icon: string;
  url: string;
  color: string;
  event: string;
  rightSection: string;
  label: string;
  sort: number;
}

export interface Navbar extends NavbarWithOutId {
  id: string;
  section: string;
  status: number;
  creator?: Creator;
  createdAt?: number;
  updater?: Updater;
  updatedAt?: number;
}
