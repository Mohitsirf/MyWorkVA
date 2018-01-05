/**
 * Created by jatinverma on 8/31/17.
 */

import {Component, Input} from '@angular/core';
import {Email} from '../models/email';
import {Router} from '@angular/router';


@Component({
  selector: 'va-email-list',
  template: `    
    <div fxLayoutAlign="center stretch" fxLayout="row" fxLayoutWrap fxLayoutGap="20px">
      <va-add-card (click)="composeButtonTapped()" [icon]="'email'">Compose</va-add-card>

      <va-email-card (isReplicating)="isReplicating($event)" *ngFor="let email of emails"
                     [email]="email"></va-email-card>
      <span *vaFlexAlignmentHack></span>
    </div>
    <va-center-spinner *ngIf="showSpinner"></va-center-spinner>

  `,
  styles: [`
    va-add-card, va-email-card {
      height: 360px;
    }
    
    span, va-add-card, va-email-card  {
      width: 250px;
      margin-bottom: 30px;
    }
  `]
})

export class EmailListComponent {
  showSpinner = false;
  @Input() emails: Email[];

  constructor(private router: Router) {}

  composeButtonTapped() {
    this.router.navigate(['emails/send']);
  }

  isReplicating(value: boolean) {
    window.scrollTo(0, 0);
    this.showSpinner = value;
  }
}
