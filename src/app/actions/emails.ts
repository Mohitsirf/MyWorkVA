import {Action} from '@ngrx/store';
import {Email} from '../models/email';

export const EMAIL_LIST_REQUEST = '[Email] Email List Request';
export const EMAIL_LIST_SUCCESS = '[Email] Email List Success';
export const EMAIL_STORE_REQUEST = '[Email] Email Store Request';
export const EMAIL_STORE_SUCCESS = '[Email] Email Store Success';
export const EMAIL_DELETE_REQUEST = '[Email] Email Delete Request';
export const EMAIL_DELETE_SUCCESS = '[Email] Email Delete Success';
export const EMAIL_CLONE_REQUEST = '[Email] Email Clone Request';
export const EMAIL_CLONE_SUCCESS = '[Email] Email Clone Success';
export const EMAIL_UPDATE_SUCCESS = '[Email] Email Update Success';
export const EMAIL_SENT = '[Email] Email Sent';

export class EmailListRequestAction implements Action {
  readonly type = EMAIL_LIST_REQUEST;
}

export class EmailListSuccessAction implements Action {
  readonly type = EMAIL_LIST_SUCCESS;

  constructor(public payload: Email[]) {
  }
}

export class EmailStoreRequestAction implements Action {
  readonly type = EMAIL_STORE_REQUEST;
}

export class EmailStoreSuccessAction implements Action {
  readonly type = EMAIL_STORE_SUCCESS;

  constructor(public payload: Email) {
  }
}

export class EmailDeleteRequestAction implements Action {
  readonly type = EMAIL_DELETE_REQUEST;
}

export class EmailDeleteSuccessAction implements Action {
  readonly type = EMAIL_DELETE_SUCCESS;

  constructor(public payload: number) {
  }
}

export class EmailCloneRequestAcion implements Action {
  readonly type = EMAIL_CLONE_REQUEST;
}

export class EmailCloneSuccessAction implements Action {
  readonly type = EMAIL_CLONE_SUCCESS;

  constructor(public payload: Email) {
  }
}

export class EmailUpdateSuccessAction implements Action {
  readonly type = EMAIL_UPDATE_SUCCESS;

  constructor(public payload: Email) {
  }
}

export class EmailSentAction implements Action {
  readonly type = EMAIL_SENT;

  constructor(public payload: number) {
  }
}
