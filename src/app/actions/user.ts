import {Action} from '@ngrx/store';
import {User} from '../models/user';

export const LOGIN_REQUEST = '[USER] Login Request';
export const LOGIN_SUCCESS = '[USER] Login Success';
export const SIGNIN_SUCCESS = '[USER] SignIn Success';
export const LOGOUT_ACTION = '[USER] Logout Success';
export const USER_PROFILE_REQUEST = '[USER] Profile Request';
export const USER_PROFILE_SUCCESS = '[USER] Profile Success';
export const USER_UPDATE_SUCCESS = '[USER] Account Reset Success';
export const USER_PLAN_SUBSCRIBE = '[USER] Plan subscribe';
export const USER_PLAN_UNSUBSCRIBE = '[USER] Plan unsubscribe';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class LoginRequestAction implements Action {
  readonly type = LOGIN_REQUEST;
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: User) {
  }
}

export class SignInSuccessAction implements Action {
  readonly type = SIGNIN_SUCCESS;

  constructor(public payload: User) {
  }
}

export class LogoutAction implements Action {
  readonly type = LOGOUT_ACTION;
}

export class UserProfileRequestAction implements Action {
  readonly type = USER_PROFILE_REQUEST;
}

export class UserProfileSuccessAction implements Action {
  readonly type = USER_PROFILE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class UserUpdateAction implements Action {
  readonly type = USER_UPDATE_SUCCESS;

  constructor(public payload: User) {
  }
}

export class UserPlanSubscribeAction implements Action {
  readonly type = USER_PLAN_SUBSCRIBE;

  constructor(public payload: string) {
  }
}

