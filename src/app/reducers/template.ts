import {Template} from '../models/template';
import {Action} from '@ngrx/store';
import {
  TEMPLATE_DELETE_ACTION,
  TEMPLATE_LIST_REQUEST, TEMPLATE_LIST_SUCCESS, TEMPLATE_STORE_REQUEST,
  TEMPLATE_STORE_SUCCESS, TEMPLATE_UPDATE_SUCCESS
} from '../actions/template';
import Utils from '../utils';
import {createSelector} from 'reselect';

export interface TemplateState {
  ids: number[];
  entities: { [id: number]: Template };
  loaded: boolean;
  loading: boolean;
}

export const initialState: TemplateState = {
  ids: [],
  entities: {},
  loaded: false,
  loading: false
};
export function reducer(state = initialState, action: Action): TemplateState {
  switch (action.type) {
       case TEMPLATE_LIST_REQUEST: {
         return {...state, ...{loading: true}};
       }
       case TEMPLATE_LIST_SUCCESS: {
         const templates = action.payload;
         const obj = Utils.normalize(templates);
         let ids = templates.map((template) => template.id);
         ids = Utils.filterDuplicateIds([...state.ids, ...ids]);
         const entities = {...state.entities, ...obj};
         return {...state, ...{ids: ids, entities: entities, loaded: true, loading: false}};
       }
       case TEMPLATE_UPDATE_SUCCESS: {
         const template = action.payload;
         const entity = { [template.id]: template};
         const entities = {...state.entities, ...entity};
         return { ...state, ...{entities: entities}};
       }
       case TEMPLATE_STORE_SUCCESS: {
         const template = action.payload;
         const id = template.id;
         const obj = {[id]: template };
         let ids = [...state.ids, ...id ];
         ids = Utils.filterDuplicateIds(ids);
         const entities = {...state.entities, ...obj };
         return {...state, ...{ids: ids, entities: entities}};
       }
       case TEMPLATE_DELETE_ACTION: {
         const id = action.payload;
         const newIds = state.ids.filter((elem) => elem !== id);
         const newEntities = Utils.removeKey(state.entities, id);
         return {...state, ...{ids: newIds, entities: newEntities}};
       }
       default: {
         return state;
       }
  }
}


export const getIds = (state: TemplateState) => state.ids;
export const getEntities = (state: TemplateState) => state.entities;
export const getTemplates = createSelector(getIds, getEntities, (ids, entities) => ids.map((id) => entities[id]));
export const getLoading = (state: TemplateState) => state.loading;
export const getLoaded = (state: TemplateState) => state.loaded;
