import {Action} from '@ngrx/store';
import Utils from '../utils';
import {Video} from '../models/video';
import {
  VIDEO_DELETE_REQUEST, VIDEO_DELETE_SUCCESS, VIDEO_IMPORT_SUCCESS, VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS, VIDEO_UPDATE_SUCCESS
} from '../actions/video';
import {createSelector} from 'reselect';

export interface VideoState {
    ids: number[];
    entities: { [id: number]: Video};
    loading: boolean;
    loaded: boolean;
}

export const initialState: VideoState = {
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
};

export function reducer(state = initialState, action: Action): VideoState {
    switch (action.type) {
        case VIDEO_IMPORT_SUCCESS: {
          const video = action.payload;
          const obj = { [video.id]: video};
          const newIds = [ ...state.ids , video.id];
          const entities = { ...state.entities, ...obj};
          return {...state, ...{ids: newIds, entities: entities}};
        }
      case VIDEO_LIST_REQUEST: {
        return {...state, ...{loading: true}};
      }
        case VIDEO_LIST_SUCCESS: {
            const videos = action.payload;
            const obj = Utils.normalize(videos);
            const ids = videos.map((video) => video.id);

            const newIds = Utils.filterDuplicateIds([...state.ids, ...ids]);

            const entities = {...state.entities, ...obj};

            return {...state, ...{ids: newIds, entities: entities, loading: false, loaded: true}};
        }
        case VIDEO_DELETE_REQUEST:
        case VIDEO_DELETE_SUCCESS: {
           const id = action.payload;
           const newIds = state.ids.filter((elem) => elem !== id);
           const newEntities = Utils.removeKey(state.entities, id);
           return {...state, ...{ids: newIds, entities: newEntities}};
        }
        case VIDEO_UPDATE_SUCCESS: {
         const video = action.payload;
         const entity = {[video.id]: video};
         const entities = {...state.entities, ...entity};
         return {...state, ...{entities: entities}};
        }
        default: {
            return state;
        }
    }
}

export const getEntities = (state: VideoState) => state.entities;
export const getIds = (state: VideoState) => state.ids;
export const getVideos = createSelector(getIds, getEntities, (ids, entities) => ids.map((id) => entities[id]));
export const getLoading = (state: VideoState) => state.loading;
export const getLoaded = (state: VideoState) => state.loaded;
