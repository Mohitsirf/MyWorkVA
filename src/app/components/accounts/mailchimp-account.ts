/**
 * Created by jatinverma on 8/26/17.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {VaetasService} from '../../services/vaetas';
import {Account} from '../../models/accounts/account';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'va-mailchimp-account',
  template: `
    <mat-dialog-content>
      <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">
        <mat-card fxFlex="100%">
          <h1><img src="/assets/images/mailchimp.png"
                   style="height: 50px;width: 50px" fxFlexAlign="center center"
                   class="primary"/> MailChimp</h1>
          <form fxLayoutGap="10px" [formGroup]="form">
            <mat-form-field style="width: 80%;" formGroupName="token">
              <mat-placeholder>
                Enter Api Key
              </mat-placeholder>
              <input matInput formControlName="api_key" type="text">
              <mat-error>Provide Api Key</mat-error>
            </mat-form-field>
          </form>
          <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px">
            <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="primary" [disabled]="loading"
                    (click)="form.valid && onSubmit()" color="accent">
              Save
            </button>
            <button mat-raised-button (click)="cancelButtonPressed()" color="white">
              Cancel
            </button>
            <button *ngIf="account" mat-raised-button style=" background-color: red; color: white"
                    (click)="delete(account.id)">
              Delete
            </button>
          </div>
        </mat-card>
      </div>
    </mat-dialog-content>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    mat-dialog-content {
      padding: 0px;
      margin-bottom: -22px;
    }
  `]
})

export class MailChimpAccountComponent implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(private dialog: MatDialogRef<MailChimpAccountComponent>, @Inject(MAT_DIALOG_DATA) private account: Account,
              private service: VaetasService, private alertService: AlertService) {

  }

  ngOnInit() {
    const apiKey = this.account ? this.account.token.api_key : null;
    this.form = new FormGroup({
      'type_id': new FormControl(1, [Validators.required]),
      'token': new FormGroup({
        'api_key': new FormControl(apiKey, [Validators.required])
      })
    });
  }

  onSubmit() {
    this.loading = true;
    console.log(this.form.value);
    this.service.storeAccount(this.form.value).subscribe(() => {
      this.alertService.success('Account Added');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }

  cancelButtonPressed() {
    this.dialog.close();
  }

  delete(id: number) {
    this.dialog.close();
    this.service.deleteAccount(id).subscribe(() => {
      this.alertService.success('Account Deleted');
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }
}


