/**
 * Created by jatinverma on 8/25/17.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MailChimpAccountComponent} from './accounts/mailchimp-account';
import {GetResponseAccountComponent} from './accounts/getresponse-account';
import {IContactAccountComponent} from './accounts/icontact-account';
import {VaetasService} from '../services/vaetas';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {environment} from '../../environments/environment';
import {AccountType} from '../models/accounts/account';

@Component({
  selector: 'va-account-list',
  template: `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-new-account-card [type]="AccountType.GOOGLE" (click)="oauth(AccountType.GOOGLE)">Gmail</va-new-account-card>
      <va-new-account-card [type]="AccountType.OUTLOOK" (click)="oauth(AccountType.OUTLOOK)">Outlook
      </va-new-account-card>
      <va-new-account-card [type]="AccountType.MAILCHIMP" (click)="openAccountForm(AccountType.MAILCHIMP)">MailChimp
      </va-new-account-card>
      <va-new-account-card [type]="AccountType.GETRESPONSE" (click)="openAccountForm(AccountType.GETRESPONSE)">
        GetResponse
      </va-new-account-card>
      <va-new-account-card [type]="AccountType.AWEBER" (click)="oauth(AccountType.AWEBER)">AWeber</va-new-account-card>
      <va-new-account-card [type]="AccountType.ICONTACT" (click)="openAccountForm(AccountType.ICONTACT)">
        iContact
      </va-new-account-card>
      <va-new-account-card [type]="AccountType.CONSTANT_CONTACT" (click)="oauth(AccountType.CONSTANT_CONTACT)">
        Constant Contact
      </va-new-account-card>
      <span *vaFlexAlignmentHack></span>
    </div>
    <va-center-spinner *ngIf="!token"></va-center-spinner>
  `,
  styles: [`
    :host {
      position: relative;
    }

    span {
      width: 235px;
    }

    va-new-account-card {
      width: 235px;
      height: 200px;
      margin-bottom: 20px;
    }
  `]
})

export class AddAccountPageComponent implements OnInit, OnDestroy {
  user_id;
  alive = true;
  token: string;
  AccountType = AccountType;

  constructor(private dialog: MatDialog, private service: VaetasService, private store: Store<State>) {

  }

  ngOnInit() {
    this.store.select(getUser).takeWhile(() => this.alive).subscribe((user) => {
      this.user_id = user.id;
    });

    this.getAuthToken();
  }

  openAccountForm(type: string) {
    this.dialog.open(this.getComponentForAccount(type), {disableClose: true}).updateSize('70%');
  }

  getComponentForAccount(type: string): any {
    switch (type) {
      case AccountType.MAILCHIMP:
        return MailChimpAccountComponent;
      case AccountType.GETRESPONSE:
        return GetResponseAccountComponent;
      case AccountType.ICONTACT:
        return IContactAccountComponent;
      default:
        return null;
    }
  }

  oauth(service: string) {
    const win = window.open(environment.vaetasOauthBaseUrl + '/oauth/' + service + '?token=' + this.token,
      '_blank');

    const pollTimer = window.setInterval(() => {
      if (win.closed !== false) {
        window.clearInterval(pollTimer);
        this.service.loadAccounts().subscribe();
      }
    }, 500);

    // fetch new token
    this.getAuthToken();
  }

  getAuthToken() {
    this.token = null;
    this.service.getOAuthToken().subscribe(token => this.token = token);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
