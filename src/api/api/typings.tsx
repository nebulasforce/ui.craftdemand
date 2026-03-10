export interface Creator {
  username: string;
  nickname: string;
}

export interface Updater {
  username: string;
  nickname: string;
}

export interface ApiWithOutId {
  name: string;
  module?: string;
  path: string;
  method: string;
  description: string;
  group: string;
  type: number;
  sort: number;
}

export interface Api extends ApiWithOutId {
  id: string;
  status: number;
  creator?: Creator;
  createdAt?: number;
  updater?: Updater;
  updatedAt?: number;
}
