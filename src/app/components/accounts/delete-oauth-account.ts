/**
 * Created by jatinverma on 9/10/17.
 */
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {VaetasService} from '../../services/vaetas';
import {AlertService} from '../../services/alert';
import {Account} from '../../models/accounts/account';

@Component({
  selector: 'va-delete-oauth-account',
  template: `
    <mat-dialog-content>
      <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">

        <h2>Are you sure you want to delete this account?</h2>
        <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px">
          <mat-spinner color="accent" *ngIf="loading" style="max-height: 40px"  [diameter]="30" [strokeWidth]="4"></mat-spinner>
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
  styles: []
})

export class OAuthAccountDeleteComponent {
  loading = false;

  constructor(private dialog: MatDialogRef<OAuthAccountDeleteComponent>, private route: ActivatedRoute, private service: VaetasService,
              @Inject(MAT_DIALOG_DATA) private account: Account, private alertService: AlertService) {
  }

  onDelete() {
    this.loading = true;
    console.log(this.route);
    this.service.deleteAccount(this.account.id).subscribe(() => {
      this.dialog.close();
      this.alertService.success('Account Deleted');
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }

  cancelButtonPressed() {
    this.dialog.close();

  }
}
