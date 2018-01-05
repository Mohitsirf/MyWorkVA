import {Doccument} from '../models/doccument';
import {Action} from '@ngrx/store';
import {
  DOCCUMENT_LIST_REQUEST, DOCCUMENT_LIST_SUCCESS, DOCCUMENT_STORE_REQUEST,
  DOCCUMENT_STORE_SUCCESS
} from '../actions/doccument';
import Utils from '../utils';
import {createSelector} from "reselect";

export interface DoccumentState {
  ids: number[];
  entities: { [id: number]: Doccument};
  loaded: boolean;
  loading: boolean;
}

export const initialState: DoccumentState = {
  ids: [],
  entities: {},
  loaded: false,
  loading: false,
}

export function reducer(state = initialState, action: Action): DoccumentState {
  switch (action.type) {
    case DOCCUMENT_LIST_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case DOCCUMENT_LIST_SUCCESS: {
      const doccuments = action.payload;
      const obj = Utils.normalize(doccuments);
      let ids  = doccuments.map((doccument) => doccument.id);
      ids = Utils.filterDuplicateIds([...state.ids, ...ids]);
      const entities = { ...state.entities, ...obj};
      return { ...state, ...{ids: ids, entities: entities, loaded: true, loading: false}};
    }
    case DOCCUMENT_STORE_REQUEST: {
      return {...state, ...{loading: true}};
    }
    case DOCCUMENT_STORE_SUCCESS: {
      const doccument = action.payload;
      const id = doccument.id;
      const obj = {[id]: doccument};
      const newIds = [...state.ids, ...id];
      const entities = {...state.entities, ...obj};
      return { ...state, ...{ids: newIds, entities: entities, loading: false, loaded: true}};
    }
    default: {
      return state;
    }
  }
}

export const getEntities = (state: DoccumentState) => state.entities;
export const getIds = (state: DoccumentState) => state.ids;
export const getDoccuments = createSelector(getIds, getEntities, (ids, entities) => ids.map((id) => entities[id]));
export const getLoading = (state: DoccumentState) => state.loading;
export const getLoaded = (state: DoccumentState) => state.loaded;
