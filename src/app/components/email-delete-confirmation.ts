/**
 * Created by jatinverma on 9/10/17.
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-delete-email',
  template: `
    <mat-dialog-content>
      <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">

        <h2>Are you sure you want to delete this email?</h2>
        <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px">
          <mat-spinner color="accent" *ngIf="loading" style="max-height: 40px"></mat-spinner>
          <button mat-raised-button style="background-color: red" [disabled]="loading"
                  (click)="onDelete()" color="accent">
            DELETE
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

export class EmailDeleteComponent {
  loading = false;
  id: number;

  constructor(private dialog: MatDialogRef<EmailDeleteComponent>, private route: ActivatedRoute,
              private service: VaetasService, private alertService: AlertService) {
  }

  onDelete() {
    this.loading = true;
    console.log(this.route);
    this.service.deleteEmail(this.id).subscribe(() => {
      this.dialog.close();
      this.alertService.success('Email Deleted');
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }

  cancelButtonPressed() {
    this.dialog.close();

  }
}
