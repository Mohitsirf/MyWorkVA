/**
 * Created by jatinverma on 8/21/17.
 */
import {Component, OnInit} from '@angular/core';
import {Account} from '../models/accounts/account';
import {Store} from '@ngrx/store';
import {accountsLoading, getAccounts, State} from '../reducers/index';
import {TimeCompare} from '../utils/time-compare';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'va-manage-account-page',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" style="margin-top: 20px;  margin-bottom: 400px;">
      <div fxLayoutAlign="center center" fxLayoutWrap fxLayout="row" fxLayoutGap="20px">
        <h1 style="color: #64a9df">My Accounts</h1>
        <button mat-mini-fab color="accent"
                (click)="addAccount.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <div *ngIf="accounts.length > 0" fxLayoutAlign="center" fxLayoutWrap fxLayoutGap="20px"
           style="margin-bottom: 20px">
        <va-account-card *ngFor="let account of accounts" [account]="account"></va-account-card>
        <span *vaFlexAlignmentHack></span>
      </div>
      <div *ngIf="accounts.length === 0" fxLayoutAlign="center center">
        <h3>You haven't added any account yet</h3>
      </div>
      <div #addAccount fxLayoutAlign="center center" fxLayoutWrap>
        <h1 style="color: #64a9df">Add a New Account</h1>
      </div>
      <div fxLayoutAlign="center center">
        <va-account-list></va-account-list>
      </div>
    </div>
    <va-center-spinner *ngIf="loading$ | async"></va-center-spinner>
  `,
  styles: [`

    span {
      width: 235px;
    }

    va-account-card {
      margin-bottom: 20px;
    }
  `
  ]
})
export class ManageAccountPageComponent implements OnInit {

  private alive = true;
  accounts: Account[];
  loading$: Observable<boolean>;

  constructor(private store: Store<State>) {

  }

  ngOnInit() {
    this.loading$ = this.store.select(accountsLoading);
    this.store.select(getAccounts).takeWhile(() => this.alive).subscribe((accounts) => {
      accounts.sort(TimeCompare.compare);
      this.accounts = accounts;
    });
  }
}

