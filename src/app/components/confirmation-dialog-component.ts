import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Dialog} from '../models/confirmation-dialog';
@Component({
  selector: 'va-confirmation-dialog',
  template: `
    <div fxLayout="column" fxLayoutGap="20px">
       <h1>{{details.title || ''}}</h1>
       <span class="text">{{details.text || 'Are you sure you want to delete?'}}</span>
       <div fxFlexAlign="end" fxLayoutGap="20px">
         <button mat-raised-button color="accent" (click)="cancel()">{{details.b1text || 'cancel'}}</button>
         <button mat-raised-button color="primary"(click)="accept()" >{{details.b2text || 'OK'}}</button>
       </div>
    </div>
  `,
  styles: [`
  .text{
    font-size: 24px;
  }
  `]
})
export class ConfirmationDialogComponent implements OnInit {
  public details: Dialog;


  constructor(@Inject(MAT_DIALOG_DATA) private data: {details: Dialog}, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  ngOnInit() {
      this.details = this.data.details;
  }

  cancel() {
    this.dialogRef.close({confirmed: false});
  }

  accept() {
    this.dialogRef.close({confirmed: true});
  }
}
