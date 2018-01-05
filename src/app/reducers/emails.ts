import {Email} from '../models/email';
import {Action} from '@ngrx/store';
import {
  EMAIL_CLONE_REQUEST, EMAIL_CLONE_SUCCESS,
  EMAIL_DELETE_REQUEST, EMAIL_DELETE_SUCCESS, EMAIL_LIST_REQUEST, EMAIL_LIST_SUCCESS, EMAIL_SENT,
  EMAIL_STORE_REQUEST, EMAIL_STORE_SUCCESS, EMAIL_UPDATE_SUCCESS
} from '../actions/emails';
import Utils from '../utils';
import {createSelector} from 'reselect';

export interface EmailState {
  ids: number[];
  entities: { [id: number]: Email };
  loading: boolean;
  loaded: boolean;
}

export const initialState: EmailState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
};

export function reducer(state = initialState, action: Action): EmailState {
  switch (action.type) {
    case EMAIL_LIST_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case EMAIL_LIST_SUCCESS: {
      const emails = action.payload;
      const obj = Utils.normalize(emails);
      const ids = emails.map((email) => email.id);
      const newIds = Utils.filterDuplicateIds([...state.ids, ...ids]);
      const entities = {...state.entities, ...obj};
      return {...state, ...{ids: newIds, entities: entities, loading: false, loaded: true}};
    }
    case EMAIL_DELETE_REQUEST:
    case EMAIL_DELETE_SUCCESS: {
      const id = action.payload;
      const newIds = state.ids.filter((elem) => elem !== id);
      const newEntities = Utils.removeKey(state.entities, id);
      return {...state, ...{ids: newIds, entities: newEntities}};
    }
    case EMAIL_STORE_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case EMAIL_STORE_SUCCESS: {
      const email = action.payload;
      const id = email.id;
      const obj = {[id]: email};
      let ids = [...state.ids, ...id];
      ids = Utils.filterDuplicateIds(ids);
      const entities = {...state.entities, ...obj};
      return {...state, ...{ids: ids, entities: entities, loading: false}};
    }
    case EMAIL_UPDATE_SUCCESS: {
      const email = action.payload;
      const entity = {[email.id]: email};
      const entities = {...state.entities, ...entity};
      return {...state, ...{entities: entities}};
    }
    case EMAIL_SENT: {
      const id = action.payload;
      const email = {...state.entities[id], ...{sent: true}};
      const entities = {...state.entities, ...{[id]: email}}
      return {...state, ...{entities: entities}};
    }
    case EMAIL_CLONE_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case EMAIL_CLONE_SUCCESS: {
      const email = action.payload;
      const id = email.id;
      const obj = {[id]: email};
      let ids = [...state.ids, ...id];
      ids = Utils.filterDuplicateIds(ids);
      const entities = {...state.entities, ...obj};
      return {...state, ...{ids: ids, entities: entities, loading: false}};
    }
    default: {
      return state;
    }
  }
}

export const getEntities = (state: EmailState) => state.entities;
export const getIds = (state: EmailState) => state.ids;
export const getEmails = createSelector(getIds, getEntities, (ids, entities) => ids.map((id) => entities[id]));
export const getloading = (state: EmailState) => state.loading;
export const getLoaded = (state: EmailState) => state.loaded;
