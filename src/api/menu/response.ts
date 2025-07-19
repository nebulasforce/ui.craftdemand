import {MenuSummary} from '@/api/menu/typings';
import {Response} from '@/api/common/response';

export interface frontItem  extends  MenuSummary{}

export interface listFrontData {
  headings: frontItem[];
  subheadings: frontItem[];
}

export interface listFrontResponse  extends  Response<listFrontData> {

}
