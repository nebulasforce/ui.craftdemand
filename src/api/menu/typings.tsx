export interface Creator {
  username: string;
  nickname: string;
}

export interface Updater {
  username: string;
  nickname: string;
}

export interface MenuSummary {
  name: string;
  icon: string;
  url: string;
  route: string;
  target: string;
  sort: number;
  children?: MenuSummary[];
}

/** 管理端菜单实体（CRUD） */
export interface Menu {
  id: string;
  name: string;
  icon: string;
  url: string;
  route?: string;
  target?: string;
  sort: number;
  parentId?: string;
  status: number;
  creator?: Creator;
  createdAt?: number;
  updater?: Updater;
  updatedAt?: number;
}
