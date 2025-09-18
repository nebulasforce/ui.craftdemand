import sRequest from '@/utils/sRequest';
import { myInfoRequest, mySubAccountListRequest } from '@/api/my/request';
import { Options } from '@/api/common/request';
import { myInfoResponse, mySubAccountListResponse } from '@/api/my/response';



export async function myInfo(req?:myInfoRequest,options?:Options) {
  return sRequest<myInfoResponse>({
    url: '/api/v1/my/info',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: req || {},
    ...(options || {}),
  });
}

//  mySubAccountList 获取个人子账号分页列表
export async function mySubAccountList(req?:mySubAccountListRequest,options?:Options) {
  return sRequest<mySubAccountListResponse>({
    url: '/api/v1/my/sub-account',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: req || {},
    ...(options || {}),
  });
}
