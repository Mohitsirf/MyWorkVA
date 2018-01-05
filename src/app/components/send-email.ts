import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Account, AccountType} from '../models/accounts/account';
import {Email} from '../models/email';
import {StringUtils} from '../utils/string';
import {DEFAULT_LOGO_URL, TRANSPARENT_IMAGE_URL} from '../utils/constants';

@Component({
  selector: 'va-send-email',
  template: `
    <div fxLayout="row" fxLayout.lt-md="column" fxLayoutGap="10px" style="padding: 10px">
      <div fxFlex="1 1 auto" #customThumb></div>
      <div fxFlex="0 1 500px" [ngSwitch]="account.type.slug">
        <va-mailchimp-deploy *ngSwitchCase="type.MAILCHIMP" [email]="email"
                             [selectedAccountId]="account.id"></va-mailchimp-deploy>
        <va-constant-contact-deploy *ngSwitchCase="type.CONSTANT_CONTACT" [email]="email"
                                    [selectedAccountId]="account.id"></va-constant-contact-deploy>
        <va-icontact-deploy *ngSwitchCase="type.ICONTACT" [email]="email"
                            [selectedAccountId]="account.id"></va-icontact-deploy>
        <va-get-response-deploy *ngSwitchCase="type.GETRESPONSE" [email]="email"
                                [selectedAccountId]="account.id"></va-get-response-deploy>
        <va-aweber-deploy *ngSwitchCase="type.AWEBER" [email]="email"
                          [selectedAccountId]="account.id"></va-aweber-deploy>
        <va-google-deploy *ngSwitchCase="type.GOOGLE" [email]="email"
                          [selectedAccountId]="account.id"></va-google-deploy>
        <va-outlook-deploy *ngSwitchCase="type.OUTLOOK" [email]="email"
                           [selectedAccountId]="account.id"></va-outlook-deploy>
      </div>
    </div>
  `,
  styles: []
})

export class SendEmailComponent implements OnInit {

  _email: Email;
  shadow: any;
  @Input() account: Account;

  @Input()
  set email(data: Email) {
    this._email = data;
    this.setupPreview();
  }

  get email(): Email {
    return this._email;
  }

  type = AccountType;
  @ViewChild('customThumb') htmlContainer: ElementRef;

  ngOnInit() {
    this.shadow = this.htmlContainer.nativeElement.attachShadow({mode: 'open'});
    this.setupPreview();
  }

  setupPreview() {
    if (!this.shadow) {
      return;
    }
    this.shadow.innerHTML = StringUtils.replaceAll(this.email.html, DEFAULT_LOGO_URL, TRANSPARENT_IMAGE_URL);
    this.shadow.querySelectorAll('a').forEach(x => x.setAttribute('target', '_blank'));
  }
}
