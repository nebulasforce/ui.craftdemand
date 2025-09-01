import { Response } from '@/api/common/response';

export interface uploadData {
  target: string;
  key: string;
}


export interface uploadResponse extends  Response<uploadData>{
}
