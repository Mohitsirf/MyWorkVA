import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert';
import {getUser, State} from '../reducers/index';
import {Store} from '@ngrx/store';
import {Plan, User} from '../models/user';
import {VaetasService} from '../services/vaetas';

@Component({
  selector: 'va-billing',
  template: `
    <div fxLayout="column" fxLayoutAlign="start start">
      <div fxFlex="0 0 auto" fxLayout="row" fxLayoutGap="30px" fxLayoutAlign="start center">
        <div style="margin-top: 20px" fxLayoutGap="20px">
          <label> Current Plan :</label>
          <label>{{plan}}</label>
        </div>

        <button *ngIf="!user.stripe_plan" mat-raised-button color="accent" routerLink="/upgrade">Buy Pro!
        </button>
        <button *ngIf="user.stripe_plan && !user.grace_period" [disabled]="loading" mat-raised-button color="accent"
                (click)="unsubscribe()">
          Unsubscribe
        </button>
        <button *ngIf="user.stripe_plan && user.grace_period" [disabled]="loading" mat-raised-button color="accent"
                (click)="resubscribe()">
          Resubscribe
        </button>
        <mat-spinner *ngIf="loading" [diameter]="30" [strokeWidth]="4" color="accent"></mat-spinner>
      </div>
    </div>`,
  styles: []
})

export class BillingComponent implements OnInit, OnDestroy {
  plan: String;
  user: User;
  alive = true;
  loading = false;

  ngOnInit(): void {
    this.store.select(getUser).takeWhile(() => this.alive).subscribe(
      user => {
        this.user = user;
        this.plan = 'Vaetas Connect';
        if (user.stripe_plan) {
          if (user.stripe_plan === Plan.PRO_MONTHLY) {
            this.plan = 'Vaetas Pro Monthly';
          } else {
            this.plan = 'Vaetas Pro Annual';
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }


  constructor(private alertService: AlertService, private store: Store<State>, private service: VaetasService) {

  }

  unsubscribe() {
    this.loading = true;
    this.service.unsubscribeFromPlan().subscribe(() => {
        this.loading = false;
        this.alertService.success('Unsubscribed from ' + this.plan + ' successfully');
      },
      error => {
        this.loading = false;
        this.alertService.error(error.message);
      }
    );
  }

  resubscribe() {
    this.loading = true;
    this.service.resubscribeToPlan().subscribe(() => {
        this.loading = false;
        this.alertService.success('Resubscribed to ' + this.plan + ' successfully');
      },
      error => {
        this.loading = false;
        this.alertService.error(error.message);
      }
    );
  }
}
