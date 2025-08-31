import { Response, Result } from '@/api/common/response';
import { User } from '@/api/me/typings';

export interface meResponse extends  Response<User>{}

export interface editMyProfileData extends Result{
  id: string
}
export interface editMyProfileResponse extends Response<editMyProfileData> {}
