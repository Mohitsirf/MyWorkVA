import {createSelector} from 'reselect';
import {ActionReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import {compose} from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import {storeFreeze} from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import {combineReducers} from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromUser from './user';
import * as fromVideos from './videos';
import * as fromCtas from './ctas';
import * as fromAccounts from './accounts';
import * as fromLayout from './layout';
import * as fromTemplate from './template';
import * as fromDoccument from './doccument';
import * as fromEmail from './emails';
import {LOGOUT_ACTION} from '../actions/user';
import {getAccountLists} from './accounts';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  user: fromUser.UserState;
  videos: fromVideos.VideoState;
  ctas: fromCtas.CtaState;
  accounts: fromAccounts.AccountState;
  layout: fromLayout.LayoutState;
  template: fromTemplate.TemplateState;
  doccuments: fromDoccument.DoccumentState;
  emails: fromEmail.EmailState;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  user: fromUser.reducer,
  videos: fromVideos.reducer,
  ctas: fromCtas.reducer,
  accounts: fromAccounts.reducer,
  layout: fromLayout.reducer,
  template: fromTemplate.reducer,
  doccuments: fromDoccument.reducer,
  emails: fromEmail.reducer,
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {

  state = (action.type === LOGOUT_ACTION) ? undefined : state;

  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}


export const getUserState = (state: State) => state.user;
export const getVideoState = (state: State) => state.videos;
export const getCtaState = (state: State) => state.ctas;
export const getAccountState = (state: State) => state.accounts;
export const getLayoutState = (state: State) => state.layout;
export const getTemplateState = (state: State) => state.template;
export const getDoccumentState = (state: State) => state.doccuments;
export const getEmailState = (state: State) => state.emails;


export const getUser = createSelector(getUserState, fromUser.getUser);
export const loggingIn = createSelector(getUserState, fromUser.isLoggingIn);
export const loggedIn = createSelector(getUserState, fromUser.isLoggedIn);

export const getTemplateEntities = createSelector(getTemplateState, fromTemplate.getEntities);
export const getTemplates = createSelector(getTemplateState, fromTemplate.getTemplates);
export const getTemplatesLoading = createSelector(getTemplateState, fromTemplate.getLoading);
export const getTemplatesLoaded = createSelector(getTemplateState, fromTemplate.getLoaded);
export const getTemplate = (state: State, id: number) => {
  const entities = getTemplateEntities(state);
  return entities[id];
}

export const getVideosEntities = createSelector(getVideoState, fromVideos.getEntities);
export const getVideoIds = createSelector(getVideoState, fromVideos.getIds);
export const getVideos = createSelector(getVideoState, fromVideos.getVideos);
export const getVideosLoading = createSelector(getVideoState, fromVideos.getLoading);
export const getVideosLoaded = createSelector(getVideoState, fromVideos.getLoaded);
export const getVideo = (state: State, id: number) => {
  const entities = getVideosEntities(state);
  return entities[id];
}


export const getDoccumentEntities = createSelector(getDoccumentState, fromDoccument.getEntities);
export const getDoccumentIds = createSelector(getDoccumentState, fromDoccument.getIds);
export const getDoccuments = createSelector(getDoccumentState, fromDoccument.getDoccuments);
export const getDoccumentsLoading = createSelector(getDoccumentState, fromDoccument.getLoading);
export const getDoccumentsLoaded =  createSelector(getDoccumentState, fromDoccument.getLoaded);

export const getAccountEntities = createSelector(getAccountState, fromAccounts.getEntities);
export const accountsLoaded = createSelector(getAccountState, fromAccounts.isAccountsLoaded);
export const accountsLoading = createSelector(getAccountState, fromAccounts.isAccountsLoading);
export const getAccounts = createSelector(getAccountState, fromAccounts.getAccounts);
export const getLists = (state: State, id: number) => {
  const list = getAccountLists(state.accounts);
  return list[id];
}

export const getRedirectUrl = createSelector(getLayoutState, fromLayout.getRedirectUrl);

export const getCtaEntities = createSelector(getCtaState, fromCtas.getEntities);
export const getCtaIds = createSelector(getCtaState, fromCtas.getIds);
export const getCtasLoading = createSelector(getCtaState, fromCtas.isLoading);
export const getCtasLoaded = createSelector(getCtaState, fromCtas.isLoaded);
export const getCtas = createSelector(getCtaState, fromCtas.getCtas);
export const getCta = (state: State, id: number) => {
  const entities = getCtaEntities(state);
  return entities[id];
}

export const getEmailEntities = createSelector(getEmailState, fromEmail.getEntities);
export const getEmailIds = createSelector(getEmailState, fromEmail.getIds);
export const getEmails = createSelector(getEmailState, fromEmail.getEmails);
export const getEmail = (state: State, id: number) => {
  const emails = getEmailEntities(state);
  return emails[id];
}
export const getEmailLoading = createSelector(getEmailState, fromEmail.getloading);
export const getEmailsLoaded = createSelector(getEmailState, fromEmail.getLoaded);
