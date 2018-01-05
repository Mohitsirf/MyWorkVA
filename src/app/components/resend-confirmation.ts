import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-resend-confirmation',
  template: `    
    <mat-dialog-content fxLayout="column" fxLayoutGap="10px">
      <div fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="center center">
        <button class="clear" *ngIf="!this.data.verifyEmail" mat-icon-button (click)="cancelButtonPressed()">
          <mat-icon>clear</mat-icon>
        </button>
        <mat-icon class="primary">mail_outline</mat-icon>
        <h1>Email Confirmation</h1>
        <div style="text-align: center; width: 70%; min-width: 700px">
          <p *ngIf="!this.data.verifyEmail">
            You need to verify you email address before you login.
          </p>
          <p *ngIf="data.verifyEmail">
            We have sent a confirmation email to <strong>{{this.data.email}}</strong>. Please click on the
            verification link to complete your registration.
          </p>
          <hr>
          <p>
            Didn't receive our email? <strong style="color: #64a9df; cursor: pointer" (click)="resendConfirmation()">
            Resend Confirmation Email</strong>
          </p>
        </div>
      </div>
      <va-center-spinner *ngIf="loading"></va-center-spinner>
    </mat-dialog-content>
  `,
  styles: [`    
    mat-icon.primary {
      font-size: 100px;
      height: 100px;
      width: 100px;
    }

    hr {
      width: 80%;
    }

    mat-dialog-content {
      position: relative;
      padding: 0px;
      margin-top: -22px;
      margin-bottom: -22px;
    }
    button.clear {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  `]
})

export class ResendConfirmationComponent implements OnInit {

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { email: string, verifyEmail: boolean },
              private service: VaetasService, private alert: AlertService, private dialog: MatDialogRef<ResendConfirmationComponent>) {
  }

  ngOnInit() {
  }

  resendConfirmation() {
    this.loading = true;
    this.service.resendVerificationEmail({email: this.data.email}).subscribe(() => {
      this.loading = false;
      this.alert.success('A email verification mail has been sent to  ' + this.data.email);
    }, (error) => {
      this.alert.error(error.message);
    });
  }

  cancelButtonPressed() {
    this.dialog.close();
  }
}
