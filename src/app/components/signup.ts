import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AlertService} from '../services/alert';
import {ResendConfirmationComponent} from './resend-confirmation';

@Component({
  selector: 'va-signup',
  template: `
    <div class="overlay" fxLayoutAlign="center center">
      <div fxLayout="column" fxFlex="450px" fxFlex.xs="90%" fxLayoutGap="20px">
        <mat-card>
          <div fxLayoutGap="10px" fxLayout="row" fxLayoutAlign="center center">
            <img height="50" src="/assets/images/logo-black.png"/>
            <h1>SIGN UP</h1>
          </div>
          <form fxLayout="column" fxLayoutAlign="center stretch"
                fxFlexAlign="center" fxLayoutGap="10px" name="form"
                [formGroup]="signupForm" (ngSubmit)="signupForm.valid && onSubmit()" novalidate>
            <div fxLayout="row" fxLayoutGap="20px">
              <mat-form-field>
                <input matInput placeholder="First Name" formControlName="first_name">
                <mat-error>First name is required</mat-error>
              </mat-form-field>
              <mat-form-field>
                <input matInput placeholder="Last Name" formControlName="last_name">
                <mat-error>Last name is required</mat-error>
              </mat-form-field>
            </div>
            <mat-form-field style="width: 100%">
              <input matInput placeholder="Email" formControlName="email">
              <mat-error>Valid email is required</mat-error>
            </mat-form-field>
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
                Sign Me Up
              </button>
            </div>
            <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" [style.margin-top]="'20px'">
              <span>Already a user? Please  </span><a routerLink="/login">LOGIN</a>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    mat-icon {
      font-size: 10px;
      height: 10px;
      width: 10px;
    }
  `]
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading = false;

  constructor(private service: VaetasService, private router: Router, private alertService: AlertService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required]),
      'password_confirmation': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {

    this.loading = true;
    this.service.signup(this.signupForm.value).subscribe(
      (response) => {
        this.dialog.open(ResendConfirmationComponent, ({
          disableClose: true, data: {
            email: this.signupForm.get('email').value,
            verifyEmail: true
          }
        }));
        this.loading = false;
      },
      (error) => {
        this.alertService.error(error.message);
        this.loading = false;
      }
    );
  }

}
