import { Response, Result } from '@/api/common/response';
import { User } from '@/api/me/typings';

export interface meResponse extends  Response<User>{}

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
