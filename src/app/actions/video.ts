import {Action} from '@ngrx/store';
import {Video} from '../models/video';

export const VIDEO_LIST_REQUEST = '[Video] List Request';
export const VIDEO_LIST_SUCCESS = '[Video] List Success';
export const VIDEO_IMPORT_SUCCESS = '[Video] Import Success';
export const VIDEO_DELETE_REQUEST = '[Video] Delete Request';
export const VIDEO_DELETE_SUCCESS = '[Video] Delete Success';
export const VIDEO_UPDATE_SUCCESS = '[Video] Update Success';

export class VideoListRequestAction implements Action {
    readonly type = VIDEO_LIST_REQUEST;
}

export class VideoListSuccessAction implements Action {
    readonly type = VIDEO_LIST_SUCCESS;

    constructor(public payload: { data: Video[] }) {
    }
}

export class VideoImportSuccessAction implements Action {
    readonly type = VIDEO_IMPORT_SUCCESS;

    constructor(public payload: { data: Video }) {
    }
}

export class VideoDeleteRequestAction implements Action {
  readonly type = VIDEO_DELETE_REQUEST;
}

export class VideoDeleteSuccessAction implements Action {
  readonly type = VIDEO_DELETE_SUCCESS;
  constructor(public payload: number) {
  }
}

export class VideoUpdateSuccessAction implements Action {
  readonly  type = VIDEO_UPDATE_SUCCESS;
  constructor (public payload: Video) {
  }
}
