export interface Department {
  id: string;
  name: string;
  code?: string;
  parentId?: string;
  sort?: number;
  status?: number;
  children?: Department[];
}
