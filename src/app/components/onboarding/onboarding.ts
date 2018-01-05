import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getUser, State} from '../../reducers/index';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'va-onboarding',
  template: `
    <div fxLayout="row" fxLayoutAlign="start center"
         style="width: 100%;position:absolute;height: 100%;background-color: #d9ecf8">
      <div fxLayoutAlign="center center" style="width: 45%;height:100%">
        <img style="height: 50% " class="logo" src="/assets/images/logo-black.png">
      </div>
      <div fxLayout="column" fxFlex="1 1 auto" fxLayoutAlign="center center"
           fxLayoutGap="40px">
        <p style="font-size: 60px">Hi {{username | async | titlecase}}!</p>
        <h2>Welcome to Vaetas, we are very excited to have you here.</h2>
        <h2>Lets quickly setup your account in three easy steps.</h2>
        <button color="accent" routerLink="/onboard/step/1" mat-raised-button>Let's Begin
        </button>
      </div>
    </div>
  `,
  styles: []
})

export class OnboardingComponent implements OnInit, OnDestroy {

  public alive = true;

  private username: Observable<String>;
  private user: any;

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.store.select(getUser).takeWhile(() => this.alive).subscribe((user) => {
      if (user.meta && user.meta.onboarding === 1) { // what if user types /onboard but he has completed some steps?
        this.router.navigate(['/onboard/step/2']);
      } else if (user.meta && user.meta.onboarding === 2) {
        this.router.navigate(['/onboard/step/3']);
      }
      this.user = user;
    });

    this.username = this.store.select(getUser).map((user) => {
      return user.first_name;

    });
  }

  constructor(private router: Router, private store: Store<State>) {
  }
}
