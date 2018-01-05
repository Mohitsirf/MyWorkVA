import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {Plan, User} from '../models/user';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';

@Component({
  selector: 'va-upgrade',
  template: `
    <div fxLayout="column" fxLayoutAlign="start center">
      <h1>Choose the Vaetas plan option that is right for you!</h1>
      <div fxLayout="row" fxLayoutAlign="space-around stretch" fxLayoutGap="20px" class="plan-container">
        <mat-card fxLayout="column" fxLayoutAlign="start center" fxFlex="400px">
          <h4>Monthly Membership</h4>
          <h2>$25/month</h2>
          <span fxFlex="1 1 auto"></span>
          <button mat-raised-button (click)="subscribeMonthly()" color="accent">Vaetas Pro monthly</button>
        </mat-card>
        <mat-card fxLayout="column" fxLayoutAlign="start center" fxFlex="400px">
          <h4>Yearly Membership</h4>
          <h2>$228/year</h2>
          <h4>2 months savings on the year!</h4>
          <button mat-raised-button (click)="subscribeAnnual()" color="accent">Vaetas Pro Annual</button>
        </mat-card>
      </div>
    </div>
    <va-center-spinner *ngIf="loading"></va-center-spinner>
  `,
  styles: [`
    .plan-container {
      max-width: 900px;
      width: 100%;
    }
  `]
})

export class UpgradeComponent implements OnInit {
  handler: any;
  user: User;
  loading = false;
  selectedPlan: Plan;

  constructor(private store: Store<State>, private service: VaetasService, private router: Router) {
  }

  ngOnInit() {
    this.store.select(getUser).subscribe(user => this.user = user);

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '/assets/images/logo-black-bg.png',
      locale: 'auto',
      allowRememberMe: false,
      token: token => {
        this.loading = true;
        this.service.subscribeToPlan({credit_card_token: token.id, stripe_plan: this.selectedPlan})
          .subscribe(() => {
            this.router.navigate(['videos']);
          });
      }
    });
  }


  subscribeMonthly() {
    this.selectedPlan = Plan.PRO_MONTHLY;
    this.handler.open({
      name: 'VAETAS PRO MONTHLY',
      description: '$25/month',
      email: this.user.email,
      amount: 2500
    });
  }

  subscribeAnnual() {
    this.selectedPlan = Plan.PRO_ANNUAL;
    this.handler.open({
      name: 'VAETAS PRO YEARLY',
      description: '$228/year',
      email: this.user.email,
      amount: 22800
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }
}
