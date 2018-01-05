import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import Utils from '../utils';
import {Error} from '../models/error';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {
  LoginRequestAction, LoginSuccessAction,
  LogoutAction, SignInSuccessAction, UserPlanSubscribeAction, UserProfileRequestAction,
  UserProfileSuccessAction, UserUpdateAction
} from '../actions/user';
import {
  CtaAddRequestAction, CtaAddSuccessAction, CtaDeleteRequestAction, CtaListRequestAction, CtaListSuccessAction,
  CtasDeleteSuccessAction, CtaUpdateAction, CtaUpdateRequestAction
} from '../actions/cta';
import {Account, AccountTypes, getAccountTitleById} from '../models/accounts/account';
import {
  AccountAddAction, AccountDeleteRequestAction, AccountDeleteSuccessAction, AccountListRequestAction,
  AccountListSuccessAction,
  AccountPasswordUpdateRequestAction, AccountPasswordUpdateSuccessAction
} from '../actions/account';
import {
  VideoDeleteRequestAction, VideoDeleteSuccessAction, VideoImportSuccessAction, VideoListRequestAction,
  VideoListSuccessAction, VideoUpdateSuccessAction
} from '../actions/video';
import {Router} from '@angular/router';
import {Template} from '../models/template';
import {
  TemplateDeleteAction, TemplateUpdateRequestAction,
  TemplatesListRequestAction, TemplatesListSuccessAction,
  TemplateStoreSuccessAction, TemplateUpdateSuccessAction
} from '../actions/template';
import {Video} from '../models/video';
import {
  DoccumentListRequestAction, DoccumentListSuccessAction,
  DoccumentStoreRequestAction, DoccumentStoreSuccessAction
} from '../actions/doccument';
import {Doccument} from '../models/doccument';
import {Cta, getCtaTitle} from '../models/cta';
import {Email} from '../models/email';
import {
  EMAIL_SENT,
  EmailCloneRequestAcion,
  EmailDeleteRequestAction, EmailDeleteSuccessAction, EmailListRequestAction, EmailListSuccessAction, EmailSentAction,
  EmailStoreRequestAction, EmailStoreSuccessAction, EmailUpdateSuccessAction
} from '../actions/emails';
import {ListsRequestAction, ListsSuccessAction} from '../actions/list';
import {CtaAnalytics} from '../models/cta-analytics';
import {Intercom} from 'ng-intercom';
import {EVENT_ACCOUNT_CONNECTED, EVENT_CTA_ADDED, EVENT_TEMPLATE_SAVED, EVENT_VIDEO_ADDED} from '../utils/constants';

const AUTH_TOKEN = 'auth_token';

@Injectable()
export class VaetasService {

  private BASE_URL = environment.vaetasApiBaseUrl;

  login(data: { email: string, password: string }): Observable<User> {
    this.store.dispatch(new LoginRequestAction());
    return this.get('/authenticate', data).map(res => {
      const jsonRes = res.json();
      localStorage.setItem(AUTH_TOKEN, jsonRes.token);
      this.store.dispatch(new LoginSuccessAction(jsonRes.user));
      return jsonRes.user;
    }).catch((error) => this.handleError(error));
  }

  signup(data: { name: string, email: string, password: string, password_confirmation: string }): Observable<User> {
    return this.post('/users/register', data).map(res => {
      this.store.dispatch(new SignInSuccessAction(res.json().user));
      return res.json().user;
    }).catch((error) => this.handleError(error));
  }

  updatePassword(data: { old_password: string, password: string, password_confirmation: string }): Observable<any> {
    this.store.dispatch(new AccountPasswordUpdateRequestAction());
    return this.patch('/me/password/reset', data).map((res) => {
      this.store.dispatch(new AccountPasswordUpdateSuccessAction());
      return {result: 'completed'};
    }).catch((error) => this.handleError(error));
  }

  updateUserDetails(data: {
    email?: string, company_name?: string, phone_number?: string, website_url?: string,
    logo_url?: string, tagline?: string, address_line_1?: string, address_line_2?: string, fb_page_url?: string, twitter_handle?: string,
    linkedin_url?: string, meta?: any
  }): Observable<any> {
    return this.patch('/me', data).map((res) => {
      const user = res.json().data;
      this.store.dispatch(new UserUpdateAction(user));
      return {result: 'completed'};
    }).catch((error) => this.handleError(error));
  }

  forgetPassword(data: { email: string }) {
    return this.post('/password/forgot', data).catch((error) => this.handleError(error));
  }

  logout() {
    localStorage.clear();
    this.store.dispatch(new LogoutAction());
  }

  resetPasswordByCode(data: { code: string, password: any, password_confirmation: any }): Observable<User> {
    return this.post('/password/reset/code', data).map(res => {
      const jsonRes = res.json();
      localStorage.setItem(AUTH_TOKEN, jsonRes.token);
      this.store.dispatch(new LoginSuccessAction(jsonRes.user));
      return jsonRes.user;
    }).catch((error) => this.handleError(error));
  }

  resendVerificationEmail(data: { email: string }): Observable<any> {
    return this.post('/users/verify/resend', data).map(() => {
      return {result: 'Verification mail sent'};
    }).catch((error) => this.handleError(error));
  }

  getDocuments(): Observable<Doccument[]> {
    this.store.dispatch(new DoccumentListRequestAction());
    return this.get('/me/documents').map((res) => {
        const doccuments = res.json().data;
        this.store.dispatch(new DoccumentListSuccessAction(doccuments));
        return doccuments;
      }
    ).catch((error) => this.handleError(error));
  }

  storeDoccument(data: { title: string, file: File }): Observable<Doccument> {
    this.store.dispatch(new DoccumentStoreRequestAction());
    const formData: FormData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);
    return this.post('/me/documents', formData).map((res) => {
      const doccument = res.json().data;
      this.store.dispatch(new DoccumentStoreSuccessAction(doccument));
      return doccument;
    }).catch((error) => this.handleError(error));
  }

  getCtas(): Observable<Cta[]> {
    this.store.dispatch(new CtaListRequestAction());
    return this.get('/cta')
      .map((res) => {
        const ctas = res.json().data;
        this.store.dispatch(new CtaListSuccessAction(ctas));
        return ctas;
      }).catch((error) => this.handleError(error));
  }


  storeCta(data: {
    type_id: number, title?: string, config: { url?: string, phone_number?: number, file_url?: string },
    top_text: string, bottom_text: string
  }): Observable<Cta> {
    this.store.dispatch(new CtaAddRequestAction());
    return this.post('/cta', data).map((res) => {
      const cta = res.json().data;
      this.store.dispatch(new CtaAddSuccessAction(cta));
      this.intercom.trackEvent(EVENT_CTA_ADDED, {type: getCtaTitle(data.type_id)});
      return cta;
    }).catch((error) => this.handleError(error));
  }

  updateCta(id: number, data: {
    type_id: number,
    title?: string,
    config: {
      'url'?: string, 'phone_number'?: number,
      file_url?: string, fields?: any
    }
  }): Observable<Cta> {
    this.store.dispatch(new CtaUpdateRequestAction());
    return this.patch('/cta/' + id, data).map((res) => {
      const cta = res.json().data;
      this.store.dispatch(new CtaUpdateAction(cta));
      return cta;
    }).catch((error) => this.handleError(error));
  }

  deleteCta(cta_id: number): Observable<number | Error> {
    this.store.dispatch(new CtaDeleteRequestAction());
    return this.delete('/cta/' + cta_id).map(() => {
      this.store.dispatch(new CtasDeleteSuccessAction(cta_id));
      return cta_id;
    }).catch((error) => this.handleError(error));
  }

  updateTemplate(Temp_id: number, data: { name?: string, html?: string }): Observable<Template> {
    this.store.dispatch(new TemplateUpdateRequestAction());
    return this.put('/templates/' + Temp_id, data).map((res) => {
      const template = res.json().data;
      this.store.dispatch(new TemplateUpdateSuccessAction(template));
      return template;
    }).catch((error) => this.handleError(error));
  }


  deleteTemplate(Temp_id: number): Observable<any> {
    return this.delete('/templates/' + Temp_id).map(
      () => {
        this.store.dispatch(new TemplateDeleteAction(Temp_id));
        return {result: 'completed'};
      }
    ).catch((error) => this.handleError(error));
  }

  storeTemplate(data: { name: string, html: string }): Observable<Template> {
    return this.post('/templates', data).map((res) => {
      const template = res.json().data;
      this.store.dispatch(new TemplateStoreSuccessAction(template));
      this.intercom.trackEvent(EVENT_TEMPLATE_SAVED);
      return template;
    }).catch((error) => this.handleError(error));
  }

  hasLoginToken(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN);
  }

  loadTemplates(): Observable<Template[]> {
    this.store.dispatch(new TemplatesListRequestAction());
    return this.get('/templates').map(res => {
      const templates = res.json().data;
      this.store.dispatch(new TemplatesListSuccessAction(templates));
      return templates;
    }).catch((error) => this.handleError(error));
  }

  me(): Observable<User> {

    this.store.dispatch(new UserProfileRequestAction());

    return this.get('/me').map(res => {
      const user = res.json().data;
      this.store.dispatch(new UserProfileSuccessAction(user));
      return user;
    }).catch((error) => this.handleError(error));
  }

  updateMe(data: { first_name: string, last_name: string }): Observable<User> {
    return this.patch('/me', data).map((res) => {
      const user = res.json().data;
      this.store.dispatch(new UserProfileSuccessAction(user));
      return user;
    }).catch((error) => this.handleError(error));
  }

  loadVideos(): Observable<Video[]> {
    this.store.dispatch(new VideoListRequestAction());
    return this.getVideos();
  }

  // private method called by loadVideos. This refetch after a fixed interval if duration of any videos is 0;
  private getVideos(): Observable<Video[]> {
    const videos$ = this.get('/videos').map((res) => {
      const videos = res.json().data;
      this.store.dispatch(new VideoListSuccessAction(videos));
      return videos;
    }).catch((error) => this.handleError(error));

    videos$.delay(10000).take(1).subscribe((videos) => {
      const currentTime = new Date();
      for (const video of videos) {
        const createdAt = new Date(video.created_at + ' GMT');
        const timeDiff = (currentTime.getTime() - createdAt.getTime()) / 1000;
        if ((video.duration === 0 || !video.gif) && timeDiff < 3600) {
          this.getVideos();
          break;
        }
      }
    });
    return videos$;
  }

  deleteVideo(id: number): Observable<any> {
    this.store.dispatch(new VideoDeleteRequestAction());
    return this.delete('/videos/' + id).map(() => {
      this.store.dispatch(new VideoDeleteSuccessAction(id));
      return {result: 'completed'};
    }).catch((error) => this.handleError(error));
  }

  importVideoByUrl(data: { url: string }): Observable<Video> {
    return this.post('/import/video', data).map((res) => {
      const video = res.json().data;
      if (video.duration === 0 || !video.gif) {
        this.getVideos();
      }
      this.store.dispatch(new VideoImportSuccessAction(video));
      this.intercom.trackEvent(EVENT_VIDEO_ADDED);
      return video;
    }).catch((error) => this.handleError(error));
  }

  updateVideo(id: number, data: { title: string, description: string }): Observable<Video> {
    return this.patch('/videos/' + id, data).map((res) => {
      const video = res.json().data;
      this.store.dispatch(new VideoUpdateSuccessAction(video));
      return video;
    }).catch((error) => this.handleError(error));
  }

  getEmails(): Observable<Email[]> {
    this.store.dispatch(new EmailListRequestAction());
    return this.get('/emails').map((res) => {
        const emails = res.json().data;
        this.store.dispatch(new EmailListSuccessAction(emails));
        return emails;
      }
    ).catch((error) => this.handleError(error));

  }


  storeEmail(data: { cta_id: number, video_id: number, html: string }): Observable<Email> {
    this.store.dispatch(new EmailStoreRequestAction());
    return this.post('/emails', data).map((res) => {
      const email = res.json().data;
      this.store.dispatch(new EmailStoreSuccessAction(email));
      return email;
    }).catch((error) => this.handleError(error));
  }

  updateEmail(id: number, data: { cta_id: number, video_id: number, html: string }): Observable<Email> {
    return this.patch('/emails/' + id, data).map((res) => {
      const email = res.json().data;
      this.store.dispatch(new EmailUpdateSuccessAction(email));
      return email;
    }).catch((error) => this.handleError(error));
  }

  cloneEmail(id: number, title: string): Observable<Email> {
    this.store.dispatch(new EmailCloneRequestAcion());
    return this.get('/emails/' + id + '/copy', {title: title}).map((res) => {
      const email = res.json().data;
      this.store.dispatch(new EmailStoreSuccessAction(email));
      return email;
    }).catch((error) => this.handleError(error));
  }

  deleteEmail(id: number): Observable<any> {
    this.store.dispatch(new EmailDeleteRequestAction());
    return this.delete('/emails/' + id).map(() => {
      this.store.dispatch(new EmailDeleteSuccessAction(id));
      return {result: 'completed'};
    }).catch((error) => this.handleError(error));
  }

  loadAccounts(): Observable<Account[]> {

    this.store.dispatch(new AccountListRequestAction());

    return this.get('/accounts')
      .map((res) => {
        const accounts = res.json().data || [];
        this.store.dispatch(new AccountListSuccessAction(accounts));
        return accounts;
      }).catch((error) => this.handleError(error));
  }

  storeAccount(data: {
    type_id: number, token: {
      'api_key': string, 'app_id': string,
      'app_username': string, 'app_password': string
    }
  }): Observable<Account> {
    return this.post('/accounts', data).map((res) => {
      const account = res.json().data;
      this.store.dispatch(new AccountAddAction(account));
      this.intercom.trackEvent(EVENT_ACCOUNT_CONNECTED, {type: getAccountTitleById(data.type_id)});
      return account;
    }).catch((error) => this.handleError(error));
  }

  getAccountTypes(): Observable<AccountTypes[]> {
    return this.get('/account/types').map((res) => {
      const types = res.json().data;
      return types;
    }).catch((error) => this.handleError(error));
  }

  deleteAccount(account_id: number): Observable<number | Error> {
    this.store.dispatch(new AccountDeleteRequestAction());
    return this.delete('/accounts/' + account_id).map(() => {
      this.store.dispatch(new AccountDeleteSuccessAction(account_id));
      return account_id;
    }).catch((error) => this.handleError(error));
  }

  fetchDeployAccountList(id: number): Observable<any[]> {
    this.store.dispatch(new ListsRequestAction(id));
    return this.get('/accounts/' + id + '/lists').map((res) => {
      const list = res.json();
      this.store.dispatch(new ListsSuccessAction({list, id}));
      return list;
    }).catch((error) => this.handleError(error));
  }

  loadCustomCtaStats(id: number): Observable<any[]> {
    return this.get('/form-data/' + id).map((response) => {
      return response.json().data;
    }).catch((error) => this.handleError(error));
  }

  getOAuthToken(): Observable<string> {
    return this.get('/oauth_token').map((res) => {
      const token = res.json().token;
      return token;
    }).catch((error) => this.handleError(error));
  }

  getCtaAnalytics(namespace: string): Observable<CtaAnalytics> {
    return this.get('/cta-analytics/' + namespace)
      .map((res) => {
        const analytics = res.json() || [];
        return analytics;
      }).catch((error) => this.handleError(error));
  }

  getVideoPlayStats(email_id: number, namespace: string): Observable<any[]> {
    return this.get('/video-play-analytics/' + namespace + '?email_id=' + email_id).map((res) => {
      return res.json();
    }).catch((error) => this.handleError(error));
  }


  getVideoOpenStats(email_id: number, namespace: string): Observable<any[]> {
    return this.get('/video-open-analytics/' + namespace + '?email_id=' + email_id).map((res) => {
      return res.json();
    }).catch((error) => this.handleError(error));
  }

  getCtaStats(email_id: number, namespace: string): Observable<any[]> {
    return this.get('/cta-analytics/' + namespace + '?email_id=' + email_id).map((res) => {
      return res.json();
    }).catch((error) => this.handleError(error));
  }

  deployMailchimpAccount(id: number, data: {
    subject: string, from_name: string,
    form_email: string, list_id: string, email_id: number
  }): Observable<any> {
    return this.post('/accounts/' + id + '/mailchimp/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'MailChimp'});
      return {result: 'Deployed MailChimp'};
    }).catch((error) => this.handleError(error));
  }

  deployConstantContact(id: number, data: {
    subject: string, from_name: string,
    form_email: string, list_id: string, email_id: number
  }): Observable<any> {
    return this.post('/accounts/' + id + '/cc/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'Constant Contact'});
      return {result: 'Depolyed Constant Contact'};
    }).catch((error) => this.handleError(error));
  }

  deployGetResponse(id: number, data: {
    subject: string, from_name: string,
    from_field_id: string, campaign_id: string, email_id: number
  }): Observable<any> {
    return this.post('/accounts/' + id + '/getresponse/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'GetResponse'});
      return {result: 'Depolyed GetResponse'};
    }).catch((error) => this.handleError(error));
  }

  deployGoogleAccount(id: number, data: {
    subject: string, email_id: number, to: string, cc: string,
    bcc: string
  }): Observable<any> {
    return this.post('/accounts/' + id + '/google/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'Google'});
      return {result: 'Deployed Google'};
    }).catch((error) => this.handleError(error));
  }

  deployOutlookAccount(id: number, data: {
    subject: string, email_id: number, to: string, cc: string,
    bcc: string
  }): Observable<any> {
    return this.post('/accounts/' + id + '/outlook/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'Outlook'});
      return {result: 'Deployed Outlook'};
    }).catch((error) => this.handleError(error));
  }

  deployAWeber(id: number, data: { subject: string, list_id: string, email_id: number }): Observable<any> {
    return this.post('/accounts/' + id + '/aweber/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'Aweber'});
      return {result: 'Depolyed Aweber'};
    }).catch((error) => this.handleError(error));
  }

  deployIContact(id: number, data: {
    subject: string, from_name: string,
    form_email: string, list_id: string, campaign_id: string, email_id: number
  }): Observable<any> {
    return this.post('/accounts/' + id + '/icontact/deploy', data).map(() => {
      this.store.dispatch(new EmailSentAction(data.email_id));
      this.intercom.trackEvent(EMAIL_SENT, {type: 'iContact'});
      return {result: 'Depolyed IContact'};
    }).catch((error) => this.handleError(error));
  }

  subscribeToPlan(data: { credit_card_token: string, stripe_plan: string }): Observable<any> {
    return this.post('/me/subscribe', data).map(res => {
      this.store.dispatch(new UserPlanSubscribeAction(data.stripe_plan));
      return res;
    }).catch((error) => this.handleError(error));
  }

  unsubscribeFromPlan(): Observable<any> {
    return this.post('/me/unsubscribe').map(res => {
      const user = res.json().data;
      this.store.dispatch(new UserUpdateAction(user));
      return user;
    }).catch((error) => this.handleError(error));
  }

  resubscribeToPlan(): Observable<any> {
    return this.post('/me/resubscribe').map(res => {
      const user = res.json().data;
      this.store.dispatch(new UserUpdateAction(user));
      return user;
    }).catch((error) => this.handleError(error));
  }

  verifySignUp(data: { code: string }): Observable<User> {
    this.store.dispatch(new LoginRequestAction());
    return this.get('/users/verify', data).map(res => {
      const jsonRes = res.json();
      localStorage.setItem(AUTH_TOKEN, jsonRes.token);
      this.store.dispatch(new LoginSuccessAction(jsonRes.user));
      return jsonRes.user;
    }).catch((error) => this.handleError(error));
  }

  sendPaidVerificationLink(data: { email: string, credit_card_token: string, stripe_plan: string }) {
    return this.post('/users/register/paid', data).map(res => {
      return res.json();
    }).catch((error) => this.handleError(error));
  }

  signUpPaidUser(data: {
    code: string, first_name: string,
    last_name: string, password: string, password_confirmation: string
  }): Observable<User> {
    this.store.dispatch(new LoginRequestAction());
    return this.post('/users/verify/paid', data).map(res => {
      const jsonRes = res.json();
      localStorage.setItem(AUTH_TOKEN, jsonRes.token);
      this.store.dispatch(new LoginSuccessAction(jsonRes.user));
      return jsonRes.user;
    }).catch((error) => this.handleError(error));
  }

  constructor(private http: Http, private store: Store<State>, private router: Router, private intercom: Intercom) {
  }

  private get(url: string, data?: any) {

    const options = this.buildRequestOptions();

    if (data) {
      options.params = Utils.objToSearchParams(data);
    }

    return this.http.get(this.BASE_URL + url, options);
  }

  private post(url: string, data?: any) {

    const options = this.buildRequestOptions();

    return this.http.post(this.BASE_URL + url, data, options);
  }

  private patch(url: string, data?: any) {

    const options = this.buildRequestOptions();

    return this.http.patch(this.BASE_URL + url, data, options);
  }

  private put(url: string, data?: any) {

    const options = this.buildRequestOptions();
    return this.http.put(this.BASE_URL + url, data, options);
  }

  private delete(url: string) {
    const options = this.buildRequestOptions();

    return this.http.delete(this.BASE_URL + url, options);
  }

  private buildRequestOptions(): RequestOptions {
    const options = new RequestOptions({headers: new Headers()});

    const authToken = localStorage.getItem(AUTH_TOKEN);
    if (authToken) {
      options.headers.append('Authorization', 'bearer ' + authToken);
    }
    return options;
  }

  private handleError(error: Response): Observable<Error> {

    if (error.status === 401) {
      this.router.navigate(['/logout']);
      return Observable.throw({message: 'Unauthorized access!', error: null});
    }

    const errorResponse = error.json()['errors'];
    const messageRes = error.json()['message'];
    const errorCode = error.json()['code'];

    if (typeof errorResponse === 'string') {
      return Observable.throw({message: errorResponse, error: null});
    } else if (errorResponse) {
      let message: string;
      for (const key in errorResponse) {
        if (errorResponse.hasOwnProperty(key)) {
          message = errorResponse[key];
          break;
        }
      }
      return Observable.throw({message: message, error: errorResponse, code: errorCode});
    } else if (typeof messageRes === 'string') {
      return Observable.throw({message: messageRes, error: null, code: errorCode});
    }
  }
}
