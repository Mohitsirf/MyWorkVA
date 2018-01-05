import {Action} from '@ngrx/store';

export const SET_REDIRECT_URL = '[Layout] Set Redirect Url';


export class SetRedirectUrlAction implements Action {
    readonly type = SET_REDIRECT_URL;

    constructor(public payload: string) {
    }
}
