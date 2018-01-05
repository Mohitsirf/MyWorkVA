/**
 * Created by jatinverma on 8/21/17.
 */

import {Component, Input} from '@angular/core';
import {Account, AccountType} from '../models/accounts/account';
import {MailChimpAccountComponent} from './accounts/mailchimp-account';
import {MatDialog} from '@angular/material';
import {GetResponseAccountComponent} from './accounts/getresponse-account';
import {IContactAccountComponent} from './accounts/icontact-account';
import {OAuthAccountDeleteComponent} from './accounts/delete-oauth-account';

@Component({
  selector: 'va-account-card',
  template: `
    <mat-card fxLayout="column" fxLayoutGap="20px" (click)="dialogAccordingToAccount()">
      <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
        <img src="/assets/images/{{account.type.slug}}.png"
             height="120" style="max-width: 202px" fxFlexAlign="center center" class="primary"/>
        <span>{{account.title | truncate:25}}</span>
      </div>
    </mat-card>
  `,
  styles: [`
    mat-card {
      position: relative;
      height: 200px;
      width: 235px;
    }
  `]
})


export class AccountCardComponent {
  @Input() account: Account;

  constructor(private dialog: MatDialog) {
  }

  dialogAccordingToAccount() {
    this.dialog.open(this.getComponentForAccount(), {disableClose: true, data: this.account}).updateSize('70%');
  }

  getComponentForAccount(): any {
    switch (this.account.type.slug) {
      case AccountType.MAILCHIMP:
        return MailChimpAccountComponent;
      case AccountType.GETRESPONSE:
        return GetResponseAccountComponent;
      case AccountType.ICONTACT:
        return IContactAccountComponent;
      default:
        return OAuthAccountDeleteComponent;
    }
  }
}

