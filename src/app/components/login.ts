import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VaetasService} from '../services/vaetas';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../services/alert';
import {MatDialog} from '@angular/material';
import {ResendConfirmationComponent} from './resend-confirmation';

@Component({
    selector: 'va-login',
    template: `
        <div class="overlay" fxLayoutAlign="center center">
            <div fxLayout="column" fxFlex="450px" fxFlex.xs="90%" fxLayoutGap="20px">
                <img width="100%" src="/assets/images/logo-full.png">
                <mat-card fxFlex="100%">
                    <h1>Login</h1>
                    <form fxLayout="column" fxLayoutAlign="center stretch"
                                 fxFlexAlign="center" fxLayoutGap="10px"
                                 [formGroup]="loginForm" (ngSubmit)="loginForm.valid && onSubmit()" novalidate>
                    <mat-form-field style="width: 100%;">
                        <input matInput placeholder="Email" formControlName="email">
                        <mat-hint>Your business email</mat-hint>
                        <mat-error>Valid email is required</mat-error>
                    </mat-form-field>
                    <mat-form-field style="width: 100%">
                        <input matInput type="password" placeholder="Password" formControlName="password">
                        <mat-error>Password is required</mat-error>
                    </mat-form-field>
                    <div fxLayout="row" fxLayoutAlign="end center">
                        <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
                        <button mat-raised-button fxFlexAlign="end" color="primary" [disabled]="loading"
                                color="accent">
                            Login
                        </button>
                    </div>
                    <div fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="10px" [style.margin-top]="'20px'">
                        <a routerLink="/plans">Create New Account</a>
                        <mat-icon>fiber_manual_record</mat-icon>
                        <a routerLink="/password/forget">Forgot Password?</a>
                    </div>
                </form>
                </mat-card>
            </div>
        </div>
    `,
    styles: [`
        :host {
            min-width: 300px;
            min-height: 300px;
        }
        
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

export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;

    constructor(private vaetasService: VaetasService, private alertService: AlertService,
                private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {

    }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required])
        });
    }

    onSubmit() {
        this.loading = true;

        this.vaetasService.login(this.loginForm.value).subscribe(
            (response) => {
                this.loading = false;
                this.router.navigate(['/videos']);
            },
            (error) => {
              if (error.code === 22) {
                this.dialog.open(ResendConfirmationComponent, ({
                  disableClose: true, data: {
                    email: this.loginForm.get('email').value,
                    verifyEmail: false
                  }
                }));
                this.loading = false;
              } else {
                this.alertService.error(error.message);
                this.loading = false;
              }
            }
        );
    }
}
