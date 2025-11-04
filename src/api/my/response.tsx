import { Pagination, Response, Result } from '@/api/common/response';
import { User } from '@/api/my/typings';

export interface meResponse extends  Response<User>{}
export interface myInfoResponse extends Response<User> {}

export interface editMyProfileData extends Result{
  id: string
}
export interface editMyProfileResponse extends Response<editMyProfileData> {}


export interface editMyPasswordData extends Result{
  id: string
}
export interface editMyPasswordResponse extends Response<editMyPasswordData> {}

export interface editMyUsernameData extends Result {
  id: string
}

export interface editMyUsernameResponse extends Response<editMyUsernameData> {}


export interface editMyAvatarData extends Result {
  host: string;
  key: string;
  target: string;
}

export interface editMyAvatarResponse extends Response<editMyAvatarData> {}

export interface sendVerifiedCodeData extends Result {}

export interface sendEmailVerifiedCodeResponse extends Response<sendVerifiedCodeData> {}
export interface sendMobileVerifiedCodeResponse extends Response<sendVerifiedCodeData> {}


// editMyEmailData
export interface editMyEmailData extends Result {
  id: string
}

// editMyEmailResponse
export interface editMyEmailResponse extends Response<editMyEmailData> {}


// editMyMobileData
export interface editMyMobileData extends Result {
  id: string
}

// editMyMobileResponse
export interface editMyMobileResponse extends Response<editMyMobileData> {}


export interface mySubAccountListData extends Pagination<User> {
}

export interface mySubAccountListResponse extends Response<mySubAccountListData> {}


export type myAllSubAccountListData = User[]
export interface myAllSubAccountListResponse extends Response<myAllSubAccountListData> {}


export interface myUnreadMessageCountData {
  result: boolean;
  count: number;
}

export interface myUnreadMessageCountResponse extends Response<myUnreadMessageCountData> {}


export interface deleteMySubAccountData extends Result {
  count: number;
}

export interface deleteMySubAccountResponse extends Response<deleteMySubAccountData> {}

export interface editMySubAccountData extends Result {
  id: string;
}

export interface editMySubAccountResponse extends Response<editMySubAccountData> {}

export interface createMySubAccountData extends Result {
  id: string;
}

export interface createMySubAccountResponse extends Response<createMySubAccountData> {}

export type getMySubAccountData = User;

export interface getMySubAccountResponse extends Response<getMySubAccountData> {}
