/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.auth2/index.d.ts" />
import {Injectable, NgZone} from '@angular/core';
import GoogleUser = gapi.auth2.GoogleUser;
import AuthResponse = gapi.auth2.AuthResponse;
import GoogleAuth = gapi.auth2.GoogleAuth;
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import BasicProfile = gapi.auth2.BasicProfile;
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class YoutubeService {
  private auth: GoogleAuth = null;
  private user$ = new BehaviorSubject<GoogleUser>(null);
  public isSignedIn$ = new BehaviorSubject<any>(false);
  public isAuthInit$ = new BehaviorSubject<any>(false);
  public profile$: BehaviorSubject<BasicProfile>;
  private accessToken: string | null = null;

  constructor(private http: HttpClient, public zone: NgZone) {
    gapi.load('auth2', () => this.zone.run(() => this.initAuth()));

    this.profile$ = this.user$.map((user) =>
      user && user.getBasicProfile() ? user.getBasicProfile() : null) as BehaviorSubject<BasicProfile>;

    this.user$.subscribe((user) => {
      if (user) {
        this.accessToken = user.getAuthResponse().access_token;
      }
    });
  }

  initAuth() {
    const params = {
      clientId: environment.googleClientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload'
      ].join(' ')
    };
    const auth = gapi.auth2.init(params);
    auth.then(() => this.zone.run(() => {
        console.log('auth init success')
        this.auth = auth;
        this.isAuthInit$.next(true);
      }),
      (error) => console.log('gapi.auth2.init failed', error)
    );

    // Listen for sign-in state changes.
    auth.isSignedIn.listen((val) => this.zone.run(() => {
      this.isSignedIn$.next(val);
      if (!val) {
        this.user$.next(null);
      }
    }));

    // Listen for changes to current user.
    auth.currentUser.listen((user) => this.zone.run(() => this.user$.next(user)));

    // Sign in the user if they are currently signed in.
    if (auth.isSignedIn.get() === true) {
      auth.signIn();
    }

    this.zone.run(() => this.user$.next(auth.currentUser.get()));
  }

  public signIn() {
    // TODO: throw error if auth is null
    this.auth.signIn({prompt: 'select_account'});
  }

  uploadVideo(video: any, input: { title: string, description: string, tags?: string[] }): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Not logged in to YouTube');
    }

    const data = {
      snippet: {
        title: input.title,
        description: input.description,
        tags: input.tags,
        categoryId: 22
      },
      status: {
        privacyStatus: 'unlisted',
        embeddable: true
      }
    };

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.accessToken)
      .set('Content-Type', 'application/json; charset=UTF-8')
      .set('X-Upload-Content-Length', video.size + '')
      .set('X-Upload-Content-Type', 'video/*');

    const url = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,contentDetails';
    return this.http.post(url, data, {headers: headers, observe: 'response', responseType: 'text'}).switchMap((res) => {
      const req = new HttpRequest('PUT', res.headers.get('location'), video, {
        reportProgress: true,
      });
      return this.http.request(req);
    });
  }
}
