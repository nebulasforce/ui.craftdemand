import {Response} from '@/api/common/response';
import { AccountMe } from '@/api/me/typings';

export interface meResponse extends  Response<AccountMe>{}
