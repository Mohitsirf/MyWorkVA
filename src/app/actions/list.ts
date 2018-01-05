/**
 * Created by jatinverma on 9/1/17.
 */
import {Action} from '@ngrx/store';

export const LIST_LIST_REQUEST = '[List] List Request';
export const LIST_LIST_SUCCESS = '[List] List Success';

export class ListsRequestAction implements Action {
  readonly type = LIST_LIST_REQUEST;

  constructor(public payload: number) {
  }
}

export class ListsSuccessAction implements Action {
  readonly type = LIST_LIST_SUCCESS;

  constructor(public payload: { list: any[], id: number }) {
  }
}


