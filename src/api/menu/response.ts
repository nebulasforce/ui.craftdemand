import {MenuSummary} from '@/api/menu/typings';
import {Response} from '@/api/common/response';

export interface frontItem  extends  MenuSummary{}

export interface listFrontResponse  extends  Response<frontItem[]> {

}
