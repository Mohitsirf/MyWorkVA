import {Action} from '@ngrx/store';
import {SET_REDIRECT_URL} from '../actions/layout';

export interface LayoutState {
    redirectUrl: string;
}

export const initialState: LayoutState = {
    redirectUrl: null
};

export function reducer(state = initialState, action: Action): LayoutState {
    switch (action.type) {
        case SET_REDIRECT_URL: {
            return {...state, ...{redirectUrl: action.payload}};
        }
        default: {
            return state;
        }
    }
}

export const getRedirectUrl = (state: LayoutState) => state.redirectUrl;
