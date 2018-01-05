import {Action} from '@ngrx/store';
import {Cta} from '../models/cta';

export const CTA_LIST_REQUEST = '[Cta] List Request';
export const CTA_LIST_SUCCESS = '[Cta] List Success';
export const CTA_ADD_REQUEST = '[Cta] Cta Add request';
export const CTA_ADD_SUCCESS = '[Cta] Cta Add Success';
export const CTA_DELETE_SUCCESS = '[Cta] Cta Delete Success';
export const CTA_DELETE_REQUEST = '[Cta] Cta Delete Request';
export const CTA_UPDATE_SUCCESS = '[Cta] Cta Update Request';
export const CTA_UPDATE_REQUEST = '[Cta] Cta Update Success';
export class CtaListRequestAction implements Action {
    readonly type = CTA_LIST_REQUEST;
}

export class CtaListSuccessAction implements Action {
    readonly type = CTA_LIST_SUCCESS;
    constructor(public payload: Cta[]) {
    }
}

export class CtaAddRequestAction implements Action {
    readonly type = CTA_ADD_REQUEST;
}

export class CtaAddSuccessAction implements Action {
    readonly type = CTA_ADD_SUCCESS;
    constructor(public payload: Cta) {
    }
}

export class CtaDeleteRequestAction implements Action {
  readonly type = CTA_DELETE_REQUEST;
}

export class CtasDeleteSuccessAction implements Action {
  readonly type = CTA_DELETE_SUCCESS;
  constructor(public payload: number) {
  }
}

export class CtaUpdateRequestAction implements Action {
  readonly type = CTA_UPDATE_REQUEST;
}
export class CtaUpdateAction implements Action {
  readonly type =  CTA_UPDATE_SUCCESS;
  constructor(public  payload: Cta) {

  }
}

