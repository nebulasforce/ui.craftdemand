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
  type?: number;
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
  type?: number;
  parentId?: string;
  status: number;
  /** 前端展示权限码 */
  code?: string;
  /** 已绑定的接口 ID（详情等接口可能返回） */
  apiIds?: string[];
  creator?: Creator;
  createdAt?: number;
  updater?: Updater;
  updatedAt?: number;
}
