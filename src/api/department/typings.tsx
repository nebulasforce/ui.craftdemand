export interface Department {
  id: string;
  name: string;
  code?: string;
  /** 负责人账号 ID */
  managerId?: string;
  /** 负责人展示名（若接口返回） */
  managerName?: string;
  parentId?: string;
  sort?: number;
  status?: number;
  children?: Department[];
}
