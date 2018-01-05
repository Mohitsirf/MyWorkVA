import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Cta} from '../models/cta';
import {AlertService} from '../services/alert';
import {VaetasService} from 'app/services/vaetas';

@Component({
  selector: 'va-cta-custom-html',
  template: `
    <div fxLayout="column" fxLayoutGap="10px">
      <h2>
        <mat-icon>code</mat-icon> &nbsp; Custom Html
      </h2>
      <form fxLayoutGap="7px" [formGroup]="form" (ngSubmit)="form.valid && onSubmit()" nonvalidate>
        <mat-form-field>
          <input matInput placeholder="Title" formControlName="title" required>
          <mat-error>Provide Title for CTA</mat-error>
        </mat-form-field>
        <mat-form-field formGroupName="config">
          <textarea matInput rows="6" placeholder="Html" formControlName="html" required></textarea>
          <mat-error>Provide Html</mat-error>
        </mat-form-field>
        <div fxLayout="row" fxLayoutAlign="end end">
          <mat-spinner color="accent" *ngIf="loading" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button type="submit" color="primary" [disabled]="loading" color="accent">
            Save
          </button>
          <button mat-raised-button type="button" (click)="cancelButtonPressed()" color="primary" color="white"
                  style="margin-left: 10px">
            Cancel
          </button>
          <button *ngIf="cta" type="button" mat-raised-button style="margin-left: 10px; margin-right: 10px;
           background-color: red; color: white" (click)="delete(cta.id)">
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

export class CustomHtmlCtaComponent implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(private dialog: MatDialogRef<CustomHtmlCtaComponent>, @Inject(MAT_DIALOG_DATA) private cta: Cta,
              private service: VaetasService, private alertService: AlertService) {
  }

  ngOnInit() {
    const title = this.cta ? this.cta.title : null;
    const html = this.cta ? this.cta.config.html : null;
    this.form = new FormGroup({
      'type_id': new FormControl(6, [Validators.required]),
      'title': new FormControl(title, [Validators.required]),
      'config': new FormGroup({
        'html': new FormControl(html, [Validators.required])
      }),
    });
  }

  cancelButtonPressed() {
    this.dialog.close();
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.cta) {
      this.loading = true;
      this.service.updateCta(this.cta.id, this.form.value).subscribe(() => {
        this.alertService.success('CTA Updated');
        this.dialog.close();
      }, (error) => {
        this.alertService.error(error.message);
        this.dialog.close();
      });
    } else {
      this.loading = true;
      this.service.storeCta(this.form.value).subscribe(() => {
        this.alertService.success('CTA Added');
        this.dialog.close();
      }, (error) => {
        this.alertService.error(error.message);
        this.dialog.close();
      });
    }
  }

  delete(id: number) {
    this.service.deleteCta(id).subscribe(() => {
      this.alertService.success('CTA deleted');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }
}
