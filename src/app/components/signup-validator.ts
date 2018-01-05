import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from '../reducers/index';

@Component({
  selector: 'va-signup-validator',
  template: `
    <va-center-spinner *ngIf="loading"></va-center-spinner>

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

  `]
})

export class SignupValidatorComponent implements OnInit {
  error = false;
  loading = true;

  ngOnInit(): void {

    this.service.verifySignUp({
      code: this.route.snapshot.params.code
    }).subscribe(
      (response) => {
        this.loading = false;
        this.router.navigate(['/videos']);
      },
      (error) => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  constructor(private service: VaetasService, private router: Router, private route: ActivatedRoute, private store: Store<State>) {

  }

}
