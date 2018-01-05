/**
 * Created by jatinverma on 8/6/17.
 */
import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {VaetasService} from '../services/vaetas';
import {Cta} from '../models/cta';
import {AlertService} from '../services/alert';


@Component({
  selector: 'va-cta-call',
  template: `
    <div fxLayout="column" fxLayoutGap="20px" fxFlex="100%">
      <h2>
        <mat-icon>call</mat-icon>
        Tap To Call
      </h2>
      <form fxLayout="column" fxLayoutGap="10px" [formGroup]="form" (ngSubmit)="form.valid && onSubmit()"
            nonvalidate>
        <mat-form-field>
          <input matInput placeholder="Title for CTA" formControlName="title" required>
          <mat-error>Provide Title for CTA</mat-error>
        </mat-form-field>
        <mat-form-field formGroupName="config" class="phone-field">
          <input #phoneInput matInput placeholder="Enter Your Phone Number"
                 formControlName="phone" required type="tel" (keyup)="onNumberChange()">
          <mat-hint>Best Phone Number to Receive Calls from Your Video Viewer</mat-hint>
          <mat-error>{{error}}</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Top Text" formControlName="top_text">
          <mat-error>Provide Top Text to CTA</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Bottom Text" formControlName="bottom_text">
          <mat-error>Provide Phone Text to CTA</mat-error>
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

    /deep/ .phone-field .mat-input-placeholder {
      margin-left: 50px;
    }
  `]
})

export class CallCtaComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  loading = false;
  @ViewChild('phoneInput') phoneInput: ElementRef;
  telInput: any;
  error = 'Phone number is invalid';

  ngOnInit() {
    const title = this.cta ? this.cta.title : null;
    const phone = this.cta ? this.cta.config.phone : null;
    const topText = this.cta ? this.cta.top_text : null;
    const bottomText = this.cta ? this.cta.bottom_text : null;

    this.form = new FormGroup({
      'type_id': new FormControl(2, [Validators.required]),
      'title': new FormControl(title, [Validators.required]),
      'config': new FormGroup({
        'phone': new FormControl(phone, [Validators.required, this.phoneValidation.bind(this)])
      }),
      'top_text': new FormControl(topText),
      'bottom_text': new FormControl(bottomText)
    });
  }

  constructor(private dialog: MatDialogRef<CallCtaComponent>, @Inject(MAT_DIALOG_DATA) private cta: Cta,
              private service: VaetasService, private alertService: AlertService) {

  }

  cancelButtonPressed() {
    this.dialog.close();
  }

  onSubmit() {
    const data = this.form.value;
    data.config.phone = this.telInput.intlTelInput('getNumber');
    console.log(data);
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
    this.service.deleteCta(id).subscribe(() => {
      this.alertService.success('CTA deleted');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.dialog.close();
    });
  }

  ngAfterViewInit() {
    this.telInput = jQuery(this.phoneInput.nativeElement);
    this.telInput.intlTelInput({
      formatOnDisplay: true
    });
  }

  onNumberChange() {
    const currentText = this.telInput.intlTelInput('getNumber');
    if (typeof currentText === 'string' && currentText.length > 0) {
      this.telInput.intlTelInput('setNumber', currentText);
    }
  }

  phoneValidation(control: FormControl) {
    if (!this.telInput) {
      return null;
    }

    const err = this.telInput.intlTelInput('getValidationError');

    if (!err) {
      return null;
    }

    switch (err) {
      case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
        this.error = 'Country code is invalid';
        break;
      case intlTelInputUtils.validationError.TOO_SHORT:
        this.error = 'Phone number too short';
        break;
      case intlTelInputUtils.validationError.TOO_LONG:
        this.error = 'Phone number too long';
        break;
      case intlTelInputUtils.validationError.NOT_A_NUMBER:
      default:
        this.error = 'Phone number is invalid';
        break;
    }

    return {
      phone: {
        valid: this.error
      }
    };
  }
}
