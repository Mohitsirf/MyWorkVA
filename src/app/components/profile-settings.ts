import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {VaetasService} from '../services/vaetas';
import {getUser, State} from '../reducers/index';
import {Store} from '@ngrx/store';
import {User} from '../models/user';
import {AlertService} from '../services/alert';


@Component({
  selector: 'va-profile-settings',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch">

      <form [formGroup]="profileSettingForm">

        <div fxFlex fxLayout="row" fxLayoutGap="18px" fxLayoutAlign="start center">
          <label>First Name :</label>
          <div fxLayoutGap="20px" fxLayout="row" fxLayoutAlign="start center">
            <mat-form-field fxFlex="1 0 auto">
              <input matInput formControlName="first_name" [disabled]="isEditable">
              <mat-error>This field cannot be blank</mat-error>
            </mat-form-field>
          </div>
          <label> Last Name :</label>
          <div fxLayoutGap="20px" fxLayout="row" fxLayoutAlign="start center">
            <mat-form-field fxFlex>
              <input matInput formControlName="last_name" [disabled]="isEditable">
              <mat-error>This field cannot be blank</mat-error>
            </mat-form-field>

            <button mat-fab *ngIf="!isEditable" (click)="changeStatus(true)">
              <mat-icon>create</mat-icon>
            </button>
            <button mat-fab *ngIf="isEditable" style="background-color: #00E676;" (click)="changeStatus(false)">
              <mat-icon>check</mat-icon>
            </button>
          </div>
        </div>
      </form>
      <label style="margin-top: 15px;margin-bottom: 30px" fxFlex>Email Address : {{this.user.email}}</label>

    </div>

    <div>

      <button style="margin-top: 15px" fxFlex="0 0 auto" color="accent" mat-raised-button (click)="isPswEditable=true"
              *ngIf="!isPswEditable">
        <mat-icon>vpn_key</mat-icon>
        Change Password
      </button>

      <div fxFlex="0 0 auto" style="margin-top: 15px" fxLayout="column" fxLayoutAlign="center start">
        <form [formGroup]="changePasswordForm" (submit)="changePasswordForm.valid && onSave()" (reset)="onAbandon()">
          <div fxLayout="row" fxLayoutAlign="start center" style="margin-top: 10px" fxLayoutGap="15px"
               *ngIf="isPswEditable">
            <label fxFlex>Old Password :</label>
            <mat-form-field>
              <input formControlName="old_password" type="password" matInput>
              <mat-error>Please provide your old password</mat-error>
            </mat-form-field>
          </div>
          <div fxLayout="row" fxLayoutAlign="start center" style="margin-top: 10px" fxLayoutGap="15px"
               *ngIf="isPswEditable">
            <label fxFlex>New Password :</label>
            <mat-form-field>
              <input type="password" formControlName="password" matInput>
              <mat-error>Password needs to be atleast 8 characters long</mat-error>
            </mat-form-field>
          </div>
          <div fxLayout="row" fxLayoutAlign="start center" style="margin-top: 10px" fxLayoutGap="15px"
               *ngIf="isPswEditable">
            <label fxFlex>Confirm New Password :</label>
            <mat-form-field>
              <input type="password" matInput formControlName="password_confirmation">
              <mat-error>Password needs to be atleast 8 characters long</mat-error>
            </mat-form-field>
          </div>
          <div *ngIf="isPswEditable" fxLayout="row" fxLayoutGap="35px" fxLayoutAlign="end center"
               style="margin-top: 40px;margin-bottom: 20px">
            <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button color="accent" [disabled]="loading">Save</button>
            <button mat-raised-button type="reset" [disabled]="loading">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }
  `]
})

export class ProfileSettingsComponent implements OnInit, OnDestroy {
  isEditable = false;
  isPswEditable = false;
  profileSettingForm: FormGroup;
  changePasswordForm: FormGroup;
  user: User;
  loading = false;
  private alive = false;

  constructor(private location: Location, private vaetasService: VaetasService, private store: Store<State>,
              private alertService: AlertService) {
  }

  changeStatus(enabled: boolean) {
    this.isEditable = enabled;
    enabled ? this.profileSettingForm.enable() : this.profileSettingForm.disable();
    if (!enabled) {
      this.vaetasService.updateMe(this.profileSettingForm.value).subscribe(
        () => {
          this.alertService.success('Updated');
          console.log(this.profileSettingForm.value);
        }, (error) => {
          this.alertService.error(error.message);
        });
    }
  }

  ngOnInit() {
    this.alive = true;
    this.store.select(getUser).takeWhile(() => this.alive).subscribe(
      (response) => {
        this.user = response;
      }
    );
    this.profileSettingForm = new FormGroup({
      'first_name': new FormControl(this.user.first_name, [Validators.required]),
      'last_name': new FormControl(this.user.last_name, [Validators.required])
    });
    this.profileSettingForm.disable();

    this.changePasswordForm = new FormGroup({
      'old_password': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'password_confirmation': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  onSave() {
    this.loading = true;
    if (this.changePasswordForm.get('password').value === this.changePasswordForm.get('password_confirmation').value) {
      this.vaetasService.updatePassword(this.changePasswordForm.value).subscribe(() => {
        this.loading = false;
        this.alertService.success('Password Updated');
      }, (error) => {
        this.loading = false;
        this.alertService.error(error.message);
      });
    } else {
      this.alertService.error('Passwords do not match');
      this.loading = false;
    }
  }

  onAbandon() {
    this.isPswEditable = false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
