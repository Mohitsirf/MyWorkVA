/**
 * Created by jatinverma on 8/6/17.
 */
import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Cta} from '../models/cta';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';
import {URL_REGEX} from '../utils/constants';


@Component({
  selector: 'va-auto-forward',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">
      <h1>
        <mat-icon>forward</mat-icon>
        Auto Forward
      </h1>
      <form fxLayoutGap="10px" [formGroup]="form" (ngSubmit)="form.valid && onSubmit()">
        <mat-form-field>
          <mat-placeholder>
            Title for CTA
          </mat-placeholder>
          <input matInput formControlName="title" type="text" required>
          <mat-error>Provide Title for CTA</mat-error>
        </mat-form-field>
        <mat-form-field formGroupName="config">
          <mat-placeholder>
            Enter Url
          </mat-placeholder>
          <input matInput formControlName="url" type="text" required>
          <mat-error>Provide Proper Formatted URL</mat-error>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end end" fxLayoutGap="10px">
          <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button type="submit" color="primary" [disabled]="loading" color="accent">
            Save
          </button>
          <button mat-raised-button type="button" (click)="cancelButtonPressed()" color="white">
            Cancel
          </button>
          <button *ngIf="cta" type="button" mat-raised-button style=" background-color: red; color: white"
                  (click)="delete(cta.id)">
            Delete
          </button>
        </div>
      </form>
      
    </div>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})

export class AutoForwardCtaComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(private dialog: MatDialogRef<AutoForwardCtaComponent>, @Inject(MAT_DIALOG_DATA) private cta: Cta,
              private service: VaetasService, private alertService: AlertService) {

  }

  ngOnInit() {
    const title = this.cta ? this.cta.title : null;
    const url = this.cta ? this.cta.config.url : null;

    this.form = new FormGroup({
      'type_id': new FormControl(1, [Validators.required]),
      'title': new FormControl(title, [Validators.required]),
      'config': new FormGroup({
        'url': new FormControl(url, [Validators.required,
          Validators.pattern(URL_REGEX)
        ])
      }),
    });
  }


  cancelButtonPressed() {
    this.dialog.close();
  }

  onSubmit() {
    const data = this.form.value;
    let linkUrl = data.config.url;
    if (!linkUrl.startsWith('https://') && !linkUrl.startsWith('http://')) {
      linkUrl = 'http://' + linkUrl;
    }
    data.config.url = linkUrl;
    this.loading = true;
    if (this.cta) {
      this.service.updateCta(this.cta.id, data).subscribe(() => {
        this.alertService.success('CTA Updated');
        this.dialog.close();
      }, (error) => {
        this.alertService.error(error.message);
        this.dialog.close();
      });
    } else {
      this.service.storeCta(data).subscribe(() => {
        this.alertService.success('CTA Added');
        this.dialog.close();
      }, (error) => {
        this.alertService.error(error.message);
        this.dialog.close();
      });
    }
  }

  delete(id: number) {
    this.dialog.close();
    this.service.deleteCta(id).subscribe(() => {
      this.alertService.success('CTA Deleted');
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }
}
