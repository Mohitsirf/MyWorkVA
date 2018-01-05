import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, getAccounts, getUser} from '../../reducers/index';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {VaetasService} from '../../services/vaetas';

@Component({
  selector: 'va-email-onboard',
  template: `
    <div *ngIf="!hasAccounts" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="40px">
      <va-progress-bar [stepNo]='2' style="margin-top: 20px"></va-progress-bar>
      <h2>Select any of these services,from which you want to send emails to your audience</h2>
      <va-account-list></va-account-list>
    </div>

    <div *ngIf="hasAccounts" fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="40px">
      <va-progress-bar [stepNo]='2' style="margin-top: 20px"></va-progress-bar>
      <h1 align="center">Successfully added your email account to Vaetas </h1>
      <h2 align="center">You will have the option to add other chosen email accounts from within your Vaetas dashboard.</h2>
      <h2 align="center">Click next to proceed.</h2>
      <button mat-raised-button [color]="'accent'" routerLink="/onboard/step/3">Next</button>
    </div>
  `,
  styles: []
})

export class EmailOnboardComponent implements OnInit, OnDestroy {
  user: User;
  alive = true;
  hasAccounts = false;


  ngOnDestroy(): void {
    this.alive = false;
  }

  constructor(private store: Store<State>, private router: Router, private service: VaetasService) {
  }

  ngOnInit() {
    const user$ = this.store.select(getUser).takeWhile(() => this.alive);
    user$.subscribe((user) => {
      this.user = user;
    });

    user$.take(1).subscribe(user => {
      // if (user.meta && user.meta.onboarding >= 2) {
      //   const nextStep = Math.max(user.meta.onboarding + 1, 3);
      //   this.router.navigate(['onboard', 'step', nextStep]);
      // }
    });

    this.store.select(getAccounts).takeWhile(() => this.alive).subscribe(accounts => {
      this.hasAccounts = accounts.length > 0;
      if (this.hasAccounts) {
        this.stepComplete();
      }
    });
  }

  stepComplete() {
    let data = {};
    if (this.user.meta) {
      data = {...this.user.meta};
    }
    console.log(data);
    data['onboarding'] = 2;
    this.service.updateUserDetails({meta: data}).subscribe();
  }

}
