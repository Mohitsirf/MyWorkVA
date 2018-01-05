/**
 * Created by jatinverma on 9/10/17.
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-email-cole-title',
  template: `
    <mat-dialog-content>
      <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">

        <h2>Please provide a title for the copy of email</h2>
        <mat-form-field style="width: 100%;">
          <input matInput placeholder="Title" required #title>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px" style="padding-bottom: 10px;">
          <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button [disabled]="!title.value || loading"
                  (click)="onSubmit(title.value)" color="accent">
            SUBMIT
          </button>
          <button mat-raised-button (click)="cancelButtonPressed()" color="white" [disabled]="loading">
            CANCEL
          </button>
        </div>
      </div>
    </mat-dialog-content>
  `,
  styles: [``]
})

export class EmailCloneTitleComponent {
  loading = false;
  id: number;

  constructor(private dialog: MatDialogRef<EmailCloneTitleComponent>,
              private service: VaetasService, private alertService: AlertService) {
  }

  onSubmit(title: string) {
    this.loading = true;
    this.service.cloneEmail(this.id, title).subscribe(() => {
      this.alertService.success('Email cloned');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }

  cancelButtonPressed() {
    this.dialog.close();

  }
}
