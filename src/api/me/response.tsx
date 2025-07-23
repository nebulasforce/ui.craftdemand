import {Response} from '@/api/common/response';
import { User } from '@/api/me/typings';

export interface meResponse extends  Response<User>{}
