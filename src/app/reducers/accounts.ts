import {Action} from '@ngrx/store';
import Utils from '../utils';
import {Account} from '../models/accounts/account';
import {
  ACCOUNT_ADD, ACCOUNT_DELETE_REQUEST, ACCOUNT_DELETE_SUCCESS, ACCOUNT_DETAILS_FETCH, ACCOUNT_LIST_REQUEST,
  ACCOUNT_LIST_SUCCESS,
  ACCOUNT_UPDATE
} from '../actions/account';
import {createSelector} from 'reselect';
import {LIST_LIST_REQUEST, LIST_LIST_SUCCESS} from '../actions/list';

export interface AccountState {
  ids: number[];
  entities: { [id: number]: Account };
  loaded: boolean;
  loading: boolean;
  lists: { [id: number]: any[] };
  listsLoading: { [id: number]: boolean };
}

export const initialState: AccountState = {
  ids: [],
  entities: {},
  loaded: false,
  loading: false,
  lists: {},
  listsLoading: {},
};

export function reducer(state = initialState, action: Action): AccountState {
  switch (action.type) {
    case ACCOUNT_LIST_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case ACCOUNT_LIST_SUCCESS: {
      const accounts = action.payload;

      const obj = Utils.normalize(accounts);
      const ids = accounts.map((account) => account.id);

      let newIds = [...state.ids, ...ids];
      newIds = Utils.filterDuplicateIds(newIds);

      const entities = {...state.entities, ...obj};

      return {...state, ...{ids: newIds, entities: entities, loading: false, loaded: true}};
    }
    case ACCOUNT_ADD: {
      const account = action.payload;
      const obj = {[account.id]: account};
      const ids = Utils.filterDuplicateIds([...state.ids, account.id]);
      const entities = {...state.entities, ...obj};
      return {...state, ...{ids: ids, entities: entities}};
    }
    case ACCOUNT_DELETE_REQUEST:
    case ACCOUNT_DELETE_SUCCESS: {
      const id = action.payload;
      const newIds = state.ids.filter((elem) => elem !== id);
      const newEntities = Utils.removeKey(state.entities, id);
      return {...state, ...{ids: newIds, entities: newEntities}};
    }
    case LIST_LIST_REQUEST: {
      const listsLoading = {...state.listsLoading, ...{[action.payload]: true}};
      return {...state, ...{listsLoading: listsLoading}};
    }
    case LIST_LIST_SUCCESS: {
      const listsLoading = {...state.listsLoading, ...{[action.payload.id]: false}};
      const lists = {...state.lists, ...{[action.payload.id]: action.payload.list}};
      return {...state, ...{lists: lists, listsLoading: listsLoading}};
    }
    default: {
      return state;
    }
  }
}

export const isAccountsLoaded = (state: AccountState) => state.loaded;
export const isAccountsLoading = (state: AccountState) => state.loading;
export const getEntities = (state: AccountState) => state.entities;
export const getIds = (state: AccountState) => state.ids;
export const getAccountLists = (state: AccountState) => state.lists;
export const getAccounts = createSelector(getIds, getEntities, (ids, entities) => ids.map((id) => entities[id]));

