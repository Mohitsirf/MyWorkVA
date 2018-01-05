import {Component, OnDestroy, OnInit} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';
import {
  accountsLoaded, accountsLoading, getCtasLoaded, getCtasLoading, getEmailLoading, getEmailsLoaded, getRedirectUrl,
  getVideosLoaded,
  loggedIn,
  loggingIn,
  State
} from '../reducers/index';
import {Store} from '@ngrx/store';

@Component({
  selector: 'va-bootstrap',
  template: `
    <va-error *ngIf="failedLoading" (reload)="loadBootstrapData()">Unable to load data</va-error>
    <va-center-spinner *ngIf="!failedLoading"></va-center-spinner>
  `,
  styles: []
})
export class BootstrapComponent implements OnInit, OnDestroy {

  private failedLoading = false;
  private alive = true;

  constructor(private service: VaetasService, private router: Router, private store: Store<State>) {
  }

  ngOnInit() {
    this.loadBootstrapData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private loadBootstrapData() {
    const loggedIn$ = this.store.select(loggedIn);
    const loggingIn$ = this.store.select(loggingIn);

    const videosLoaded$ = this.store.select(getVideosLoaded);
    const videosLoading$ = this.store.select(getVideosLoaded);

    const ctasLoaded$ = this.store.select(getCtasLoaded);
    const ctasLoading$ = this.store.select(getCtasLoading);

    const accountsLoaded$ = this.store.select(accountsLoaded);
    const accountsLoading$ = this.store.select(accountsLoading);

    const emailsLoaded$ = this.store.select(getEmailsLoaded);
    const emailsLoading$ = this.store.select(getEmailLoading);

    let redirectUrl: string;

    this.store.select(getRedirectUrl).subscribe((url) => redirectUrl = url || '/videos');


    loggedIn$.combineLatest(loggingIn$, (loggedIn, loggingIn) => {
      return {loggedIn, loggingIn};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loggedIn && !data.loggingIn) {
        this.service.me().subscribe(() => {
        }, (error) => {
          this.failedLoading = true;
        });
      }
    });

    videosLoaded$.combineLatest(videosLoading$, (loaded, loading) => {
      return {loaded, loading};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        console.log('data is', data);
        this.service.loadVideos().subscribe(() => {
          },
          (error) => {
            this.failedLoading = true;
          });
      }
    });

    ctasLoaded$.combineLatest(ctasLoading$, (loaded, loading) => {
      return {loaded, loading};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.getCtas().subscribe(() => {
          },
          (error) => {
            this.failedLoading = true;
          });
      }
    });

    accountsLoaded$.combineLatest(accountsLoading$, (loaded, loading) => {
      return {loaded, loading};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.loadAccounts().subscribe(() => {
          },
          (error) => {
            this.failedLoading = true;
          });
      }
    });

    emailsLoaded$.combineLatest(emailsLoading$, (loaded, loading) => {
      return {loaded, loading};
    }).takeWhile(() => this.alive).subscribe((data) => {
      if (!data.loading && !data.loaded) {
        this.service.getEmails().subscribe(() => {
          },
          (error) => {
            this.failedLoading = true;
          });
      }
    });

    loggedIn$.combineLatest(videosLoaded$, ctasLoaded$, accountsLoaded$, emailsLoaded$,
      (loggedIn, videosLoaded, ctasLoaded, accountsLoaded, emailsLoaded) => {
      return {loggedIn, videosLoaded, ctasLoaded, accountsLoaded, emailsLoaded};
    }).takeWhile(() => this.alive).subscribe(
      (data) => {
        if (data.loggedIn && data.videosLoaded && data.ctasLoaded && data.accountsLoaded && data.emailsLoaded) {
          this.router.navigateByUrl(redirectUrl);
        }
      });
  }
}
