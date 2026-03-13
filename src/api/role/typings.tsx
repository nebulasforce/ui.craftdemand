export interface Role {
  id: string;
  name: string;
  parentId?: string;
  sort?: number;
  status?: number;
  children?: Role[];
}

