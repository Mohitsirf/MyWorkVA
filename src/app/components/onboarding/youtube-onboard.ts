import {Component, OnDestroy, OnInit} from '@angular/core';
import {YoutubeService} from '../../services/youtube';
import {async} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {getUser, State} from '../../reducers/index';
import {VaetasService} from '../../services/vaetas';
import {User} from '../../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'va-youtube-onboard',
  template: `
    <div class="intro" *ngIf="(youtubeService.isAuthInit$ | async ) && !(youtubeService.isSignedIn$ | async)"
         fxLayout="column"
         fxLayoutAlign="start center" fxLayoutGap="20px">
      <va-progress-bar [stepNo]='1' style="margin-top: 20px"></va-progress-bar>
      <h2>Vaetas links with your YouTube account to host your videos. </h2>
      <h3>Each video will automatically be uploaded as <a href="https://support.google.com/youtube/answer/157177"
                                                          target="_blank">
        unlisted</a>, so the only people who will see your videos are those you choose to send them to.</h3>
      <h3>The only way the general public can search for or find your videos will be if you choose to make a video
        public.</h3>
      <button mat-raised-button color="accent" (click)="youtubeService.signIn()">Add Youtube Account</button>
    </div>
    <div *ngIf="youtubeService.profile$ | async" fxLayout="column" fxLayoutAlign="center center">
      <va-progress-bar [stepNo]='1' style="margin-top: 20px"></va-progress-bar>
      <h1>Successfully added your youtube account to Vaetas!</h1>
      <h2>Click next to proceed to the next step.</h2>
      <button mat-raised-button color="accent" routerLink="/onboard/step/2">Next</button>
    </div>
    <va-center-spinner *ngIf="!(youtubeService.isAuthInit$ | async )"></va-center-spinner>
  `,
  styles: [`
    .intro {
      padding-left: 20px;
      padding-right: 20px;
    }

    .intro h2, .intro h3 {
      text-align: center;
    }

    .intro h3 {
      color: #444;
    }
  `]
})

export class YoutubeOnboardComponent implements OnInit, OnDestroy {
  user: User;
  alive = true;

  constructor(private youtubeService: YoutubeService,
              private router: Router, private store: Store<State>, private service: VaetasService) {
  }

  ngOnInit(): void {
    const user$ = this.store.select(getUser).takeWhile(() => this.alive);
    user$.subscribe((user) => {
      this.user = user;
    });

    user$.take(1).subscribe(user => {
      if (user.meta && user.meta.onboarding >= 1) {
        const nextStep = Math.max(user.meta.onboarding + 1, 3);
        this.router.navigate(['onboard', 'step', nextStep]);
      }
    });

    this.youtubeService.isSignedIn$.subscribe(signedIn => signedIn && this.stepComplete());

  }

  stepComplete() {
    let data = {};
    if (this.user.meta) {
      data = {...this.user.meta};
    }
    data['onboarding'] = 1;
    this.service.updateUserDetails({meta: data}).subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}


