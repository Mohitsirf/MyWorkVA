import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-forgetpassword',
  template: `
    <div class="overlay" fxLayoutAlign="center center">
      <div fxLayout="column" fxFlex="450px" fxFlex.lt-sm="90%" fxLayoutGap="20px">
        <img id="img" width="100%" src="/assets/images/logo-full.png">
        <mat-card>
        <h1>Reset Password</h1> 
          <div fxLayout="row" fxLayoutAlign="start start" fxLayoutGap="10px">
            <mat-icon >info</mat-icon>
            <span>  Email will be sent to the email id,
                     which will contain a unique link to reset
              the password for your account.</span>
          </div>
          <form fxLayout="column" fxLayoutAlign="start" [formGroup]="forgetForm" 
                fxLayoutGap="20px"
                style="margin-top: 20px" nonvalidate>
            <mat-form-field  style="width: 90%">
              <input matInput placeholder="Email" formControlName="email">
              <mat-error>Valid email is required</mat-error>
            </mat-form-field>
          </form>
          <div fxLayout="row" fxLayoutAlign="space-between center">
            <button mat-raised-button  color="primary" (click)="router.navigate(['login'])">
              Log In
            </button>
            <div fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="center center">
              <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
              <button mat-raised-button fxFlexAlign="end" [disabled]="loading" (click)="forgetForm.valid && forget()" color="accent">
                Send Email
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`    
    mat-spinner {
      margin-right: 20px;
    }
  `]
})

export class ForgetPasswordComponent implements OnInit {

  forgetForm: FormGroup;
  loading = false;

  constructor( public service: VaetasService, private router: Router, private alertService: AlertService) {
  }

  ngOnInit() {
    this.forgetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  forget() {
    this.loading = true;
     this.service.forgetPassword(this.forgetForm.value).subscribe(
       (response) => {
         this.loading = false;
         this.alertService.success('An Email has been sent to' +  '  ' +  this.forgetForm.get('email').value);
         this.router.navigate(['/login']);
       },
       (error) => {
         this.loading = false;
       }
     );
  }

}

