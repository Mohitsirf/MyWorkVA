import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../services/alert';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'va-signup-paid-user',
  template: `
    <div *ngIf="!error" class="overlay" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="70px">
      <mat-card fxFlex="550px" fxFlex.xs="90%">
        <h2>Please complete your registration by providing us your name and password</h2>
        <form fxLayout="column" fxLayoutAlign="center stretch"
              fxFlexAlign="center" fxLayoutGap="10px" name="form"
              [formGroup]="signupForm" (ngSubmit)="signupForm.valid && onSubmit()" novalidate>
          <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="space-between start">
            <mat-form-field style="width: 45%">
              <input matInput placeholder="First Name" formControlName="first_name">
              <mat-error>First name is required</mat-error>
            </mat-form-field>
            <mat-form-field style="width: 45%">
              <input matInput placeholder="Last Name" formControlName="last_name">
              <mat-error>Last name is required</mat-error>
            </mat-form-field>
          </div>
          <mat-form-field style="width: 100%">
            <input matInput type="password" placeholder="Password" formControlName="password">
            <mat-error>Password is required</mat-error>
          </mat-form-field>
          <mat-form-field style="width: 100%">
            <input matInput type="password" placeholder="Confirm Password" formControlName="password_confirmation">
            <mat-error>Password is required</mat-error>
          </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="end center">
            <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
            <button mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading"
                    color="accent">
              Submit
            </button>
          </div>
        </form>
      </mat-card>
    </div>

    <div *ngIf="error" style="height: 100%;width: 100%;position: absolute" fxLayout="row" fxLayoutAlign="center center"
         fxLayoutGap="40px">
      <div fxLayoutAlign="center center">
        <mat-icon fxLayoutAlign="center center"><i class="material-icons" style="font-size: 80px">cloud_off</i>
        </mat-icon>
      </div>
      <h1>This link seems to be invalid.</h1>
    </div>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }
  `]
})

export class SignupPaidUserComponent implements OnInit {
  error = false;
  signupForm: FormGroup;
  loading = false;

  constructor(private service: VaetasService, private router: Router,
              private route: ActivatedRoute, private alertService: AlertService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
      'password_confirmation': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    this.loading = true;
    this.service.signUpPaidUser({...this.signupForm.value, code: this.route.snapshot.params.code}).subscribe(
      (response) => {
        this.loading = false;
        this.router.navigate(['/videos']);
      },
      (error) => {
        if (error.message === 'Invalid Verification Code') {
          this.error = true;
        } else {
          this.alertService.error(error.message);
        }
        this.loading = false;
      }
    );
  }


}
