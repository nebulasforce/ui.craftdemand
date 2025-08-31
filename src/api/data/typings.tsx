export interface todo {
}

export type ProvinceItem = {
  name: string;
  id: string;
}

export interface CityItem {
  province: string; // 所属省份名称
  name: string; // 城市名称
  id: string; // 城市编码
}
