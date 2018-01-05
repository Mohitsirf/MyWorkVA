/**
 * Created by jatinverma on 8/27/17.
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Account} from '../models/accounts/account';
import {Store} from '@ngrx/store';
import {getAccounts, State} from '../reducers/index';
import {TimeCompare} from '../utils/time-compare';
@Component({
  selector: 'va-account-select',
  template: `
    <div   fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-email-account-card *ngFor="let account of accounts" [account]="account" [selected]="account.id == selectedAccountId"
                         (click)="accountSelected(account)"></va-email-account-card>
      <span *vaFlexAlignmentHack></span>
    </div>
  `,
  styles: [`
    va-email-account-card {
      margin-bottom: 20px;
    }

    span {
      width: 250px;
    }
  `
  ]
})


export class SendEmailAccountSelectComponent implements OnInit, OnDestroy {
  @Input() selectedAccountId: number;
  @Output() onSelect = new EventEmitter<Account>();
  accounts: Account[];
  private alive = true;
  constructor(private store: Store<State>) {
  }

  ngOnInit() {
    this.store.select(getAccounts).takeWhile(() => this.alive).subscribe((accounts) => {
      accounts.sort(TimeCompare.compare);
      this.accounts = accounts;
    });

  }

  ngOnDestroy() {
    this.alive = false;
  }

  accountSelected(account: Account) {
    this.selectedAccountId = account.id;
    this.onSelect.emit(account);
  }
}
