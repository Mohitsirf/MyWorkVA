import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, getCtas, getUser} from '../../reducers/index';
import {User} from '../../models/user';
import {VaetasService} from '../../services/vaetas';

@Component({
  selector: 'va-cta-onboard',
  template: `
    <div *ngIf="!hasCta" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="40px">
      <va-progress-bar [stepNo]='3' style="margin-top: 20px"></va-progress-bar>
      <h2 align="center">We provide a number of Call To Actions (CTAs) that allow your viewer to take the next
        action step directly from your videos</h2>
      <h3 align="center">Let's start by creating a personalized CTA for you. Choose any of the below to begin with : </h3>
      <div fxLayoutAlign="center center">
        <va-cta-list></va-cta-list>
      </div>
    </div>

    <div *ngIf="hasCta" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="40px">
      <va-progress-bar [stepNo]='4' style="margin-top: 20px"></va-progress-bar>
      <h1>Great! You have succesfully completed setting up your account.</h1>
      <h2 align="center">Lets head over to your dashboard, click next to proceed</h2>
      <button mat-raised-button color="accent" routerLink="/videos">Next</button>
    </div>
  `,
  styles: []
})

export class CtaOnboardComponent implements OnInit, OnDestroy {
  user: User;
  alive = true;
  hasCta = false;


  ngOnDestroy(): void {
    this.alive = false;
  }

  constructor(private store: Store<State>, private service: VaetasService) {
  }

  ngOnInit() {
    this.store.select(getUser).takeWhile(() => this.alive).subscribe((user) => {
      this.user = user;
    });

    this.store.select(getCtas).takeWhile(() => this.alive).subscribe(ctas => {
      this.hasCta = ctas.length > 0;
      if (this.hasCta) {
        this.stepComplete();
      }
    });
  }

  stepComplete() {
    let data = {};
    if (this.user.meta) {
      data = {...this.user.meta};
    }
    data['onboarding'] = 3;
    this.service.updateUserDetails({meta: data}).subscribe();
  }
}
