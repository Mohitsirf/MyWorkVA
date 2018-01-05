import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-paid-verification-sent',
  template: `
    <mat-dialog-content fxLayout="column" fxLayoutGap="10px">
      <button mat-icon-button fxFlexAlign="end" (click)="dialog.close()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>Thank you for subscribing to Vaetas</h2>
      <h3>A verification mail has been sent to your email account.</h3>
    </mat-dialog-content>
  `,
  styles: [`    
    hr {
      width: 80%;
    }

    mat-dialog-content {
      position: relative;
      border:3px solid black;
      padding: 22px;
      margin-top: -24px;
      margin-bottom: -24px;
    }
  `]
})

export class PaidVerificationSentComponent implements OnInit {

  loading = false;

  constructor(private dialog: MatDialogRef<PaidVerificationSentComponent>,
              private service: VaetasService, private alert: AlertService) {
  }

  ngOnInit() {
  }

}

