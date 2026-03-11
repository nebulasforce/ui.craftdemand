export interface Creator {
  username: string;
  nickname: string;
}

export interface Updater {
  username: string;
  nickname: string;
}

export interface HeadDropdownWithOutId {
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

export interface HeadDropdown extends HeadDropdownWithOutId {
  id: string;
  section: string;
  creator?: Creator;
  createdAt?: number;
  updater?: Updater;
  updatedAt?: number;
}
