
import {Doccument} from '../models/doccument';
import {Action} from '@ngrx/store';

export const DOCCUMENT_LIST_REQUEST = '[Doccument] load doccument request';
export const DOCCUMENT_LIST_SUCCESS = '[Doccument] load doccument success';
export const DOCCUMENT_STORE_SUCCESS = '[Doccument] doccument store success';
export const DOCCUMENT_STORE_REQUEST = '[Doccument] doccument store request';

export class DoccumentListRequestAction implements Action {
  readonly type = DOCCUMENT_LIST_REQUEST;
}


export class DoccumentListSuccessAction implements Action {
  readonly type = DOCCUMENT_LIST_SUCCESS;
  constructor(public payload: Doccument[]) {
  }
}

export class DoccumentStoreRequestAction implements Action {
  readonly type = DOCCUMENT_STORE_REQUEST;
}

export class DoccumentStoreSuccessAction implements Action {
  readonly type = DOCCUMENT_STORE_SUCCESS;
  constructor(public payload: Doccument) {
  }
}
