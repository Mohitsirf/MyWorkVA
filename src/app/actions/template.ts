import {Action} from '@ngrx/store';
import {Template} from '../models/template';

export const TEMPLATE_LIST_REQUEST = '[Template] load templates request';
export const TEMPLATE_LIST_SUCCESS = '[Template] load templates success';
export const TEMPLATE_STORE_SUCCESS = '[Template] template store success';
export const TEMPLATE_STORE_REQUEST = '[Template] template store request';
export const TEMPLATE_UPDATE_SUCCESS = '[Template] template update success';
export const TEMPLATE_UPDATE_REQUEST = '[Template] template update request';
export const TEMPLATE_DELETE_ACTION = '[Template] template delete action';

export class TemplatesListRequestAction implements Action {
  readonly type = TEMPLATE_LIST_REQUEST;
}


export class TemplatesListSuccessAction implements Action {
  readonly type = TEMPLATE_LIST_SUCCESS;
  constructor(public payload: Template[]) {
  }
}

export class TemplateStoreRequestAction implements Action {
  readonly type = TEMPLATE_STORE_REQUEST;
}

export class TemplateStoreSuccessAction implements Action {
  readonly type = TEMPLATE_STORE_SUCCESS;
  constructor(public payload: Template) {
  }
}

export class TemplateUpdateRequestAction implements Action {
  readonly type = TEMPLATE_UPDATE_REQUEST;
}

export class TemplateUpdateSuccessAction implements Action {
  readonly type = TEMPLATE_UPDATE_SUCCESS;
  constructor(public payload: Template) {
  }
}

export class TemplateDeleteAction implements Action {
  readonly type = TEMPLATE_DELETE_ACTION;
  constructor(public payload: number) {
  }
}
