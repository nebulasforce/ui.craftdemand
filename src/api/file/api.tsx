import request from '@/utils/request';
import { Options } from '@/api/common/request';
import { uploadResponse } from '@/api/file/response';
import { uploadRequest } from '@/api/file/request';

export async function upload(req: uploadRequest, options?:Options) {
  return request<uploadResponse>({
    url: '/api/v1/file/upload/local',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: req,
    ...(options || {}),
  });
}
