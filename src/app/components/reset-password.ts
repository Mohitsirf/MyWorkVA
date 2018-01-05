import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-reset-password',
  template: `
    <div class="overlay" fxLayoutAlign="center center">
      <div fxLayout="column" fxFlex="450px" fxFlex.lt-sm="90%" fxLayoutGap="20px">
        <mat-card>
          <div fxLayoutGap="10px" fxLayout="row" fxLayoutAlign="center center">
            <img style="width: 50px; height: 50px" src="/assets/images/logo.png"/>
            <h1>Reset Password</h1>
          </div>
          <form fxLayout="column" fxLayoutAlign="center stretch"
                fxFlexAlign="center" fxLayoutGap="10px" name="form"
                [formGroup]="resetForm" (ngSubmit)="resetForm.valid && onSubmit()" novalidate>
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
                Reset
              </button>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [``]
})

export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  loading = false;

  constructor(private route: ActivatedRoute, private service: VaetasService, private alert: AlertService, private router: Router) {
  }

  ngOnInit() {
    this.resetForm = new FormGroup({
      'password': new FormControl(null, [Validators.required]),
      'password_confirmation': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    this.loading = true;
    const data = this.resetForm.value;
    this.route.params.subscribe((params) => {
      data['code'] = params['code'];
    });
    this.service.resetPasswordByCode(data).subscribe(() => {
      this.loading = false;
      this.alert.success('You password has been successfully updated');
      this.router.navigate(['/videos']);
    }, (error) => {
      this.alert.error(error.message);
    });
  }
}
