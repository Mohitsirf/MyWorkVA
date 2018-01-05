import {Action} from '@ngrx/store';
import {Account} from '../models/accounts/account';

export const ACCOUNT_LIST_REQUEST = '[Account] List Request';
export const ACCOUNT_LIST_SUCCESS = '[Account] List Success';
export const ACCOUNT_ADD = '[Account] Add';
export const ACCOUNT_UPDATE = '[Account] Update';
export const ACCOUNT_DETAILS_FETCH = '[Account] Details Fetch';
export const ACCOUNT_DELETE_SUCCESS = '[Account] Account Delete Success';
export const ACCOUNT_DELETE_REQUEST = '[Account] Account Delete Request';
export const ACCOUNT_PASSWORD_UPDATE_REQUEST = '[Account] Password Reset Request';
export const ACCOUNT_PASSWORD_UPDATE_SUCCESS = '[Account] Password Reset Success';


export class AccountListRequestAction implements Action {
    readonly type = ACCOUNT_LIST_REQUEST;
}

export class AccountListSuccessAction implements Action {
    readonly type = ACCOUNT_LIST_SUCCESS;

    constructor(public payload: Account[]) {
    }
}

export class AccountAddAction implements Action {
    readonly type = ACCOUNT_ADD;

    constructor(public payload:  Account ) {
    }
}

export class AccountUpdateAction implements Action {
    readonly type = ACCOUNT_UPDATE;

    constructor(public payload: Account) {
    }
}

export class AccountDeleteRequestAction implements Action {
  readonly type = ACCOUNT_DELETE_REQUEST;
}

export class AccountDeleteSuccessAction implements Action {
  readonly type = ACCOUNT_DELETE_SUCCESS;
  constructor(public payload: number) {
  }
}

export class AccountDetailsFetchAction implements Action {
    readonly type = ACCOUNT_DETAILS_FETCH;

    constructor(public payload: Account) {
    }
}
export class AccountPasswordUpdateRequestAction implements Action {
  readonly type = ACCOUNT_PASSWORD_UPDATE_REQUEST;
}

export class AccountPasswordUpdateSuccessAction implements Action {
  readonly type = ACCOUNT_PASSWORD_UPDATE_SUCCESS;
}


