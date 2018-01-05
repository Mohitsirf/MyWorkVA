import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Cta, CtaType} from '../models/cta';

import {VaetasService} from '../services/vaetas';
import {FormBuilderComponent} from './form-builder';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getCta, State} from '../reducers/index';
import {AlertService} from '../services/alert';

@Component({
  selector: 'va-cta-custom-form',
  template: `
    <div style="margin: 5%" fxLayout='column' fxFlex='100%' fxLayoutAlign="start stretch" fxLayoutGap="25px">
      <div fxLayout="row" fxLayoutAlign="center center">
        <h1>
          <mat-icon>content_paste</mat-icon>
          Custom Form
        </h1>
      </div>
      <form fxLayout='column' fxFlex='100%' fxLayoutAlign="start stretch" fxLayoutGap='10px'
            (ngSubmit)="customForm.valid && save()" [formGroup]='customForm' nonvalidate>

        <mat-form-field >
          <input matInput placeholder='Title' formControlName='title' required>
          <mat-error>Provide Title for the CTA</mat-error>
        </mat-form-field>

        <va-form-builder #formBuilder [fields]="initialFields"></va-form-builder>

        <mat-form-field >
          <input matInput placeholder='Top Text' formControlName='top_text'>
        </mat-form-field>
        <mat-form-field >
          <input matInput placeholder='Bottom Text' formControlName='bottom_text'>
        </mat-form-field>
        <div fxLayout='row' fxLayoutAlign='center center'>
          <mat-spinner color='accent' *ngIf='saving' [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button type="submit" color='accent' [disabled]="saving" >
            Save
          </button>
          <button *ngIf="cta" type="button" mat-raised-button color="warn" (click)='delete()'>
            Delete
          </button>

          <button *ngIf="cta" type="button" mat-raised-button color='primary' (click)='preview()'>
            View Response
          </button>

        </div>
      </form>
     
    </div>
  `,
  styles: [`    
    button {
      margin-left: 10px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})

export class CustomFormComponent implements OnInit, OnDestroy {
  @ViewChild('formBuilder') formBuilder: FormBuilderComponent;
  cta: Cta;
  customForm: FormGroup;
  saving = false;
  initialFields: any;
  alive = true;

  ngOnInit() {
    this.route.params.map(params => params['id']).filter((id) => !!id)
      .switchMap((id) => this.store.select((state) => getCta(state, id))).takeWhile(() => this.alive)
      .subscribe((cta) => {
        this.cta = cta;
        this.initialFields = JSON.parse(cta.config.fields);
      });
    const title = this.cta ? this.cta.title : null;
    const topText = this.cta ? this.cta.top_text : null;
    const bottomText = this.cta ? this.cta.bottom_text : null;
    this.customForm = new FormGroup({
      'title': new FormControl(title, [Validators.required]),
      'top_text': new FormControl(topText),
      'bottom_text': new FormControl(bottomText)
    });
  }

  constructor(private service: VaetasService, private alertService: AlertService,
              private router: Router, private route: ActivatedRoute, private store: Store<State>) {

  }


  save() {
    const data = this.customForm.value;
    data['config'] = {fields: this.formBuilder.getFields()};
    data['type_id'] = CtaType.CUSTOM_FORM;
    this.saving = true;

    if (this.cta) {
      this.service.updateCta(this.cta.id, data).subscribe((cta) => {
          this.cta = cta;
          this.alertService.success('CTA Updated');
          this.saving = false;
        }, (error) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      this.service.storeCta(data).subscribe((cta) => {
        this.router.navigate(['/ctas/custom-form/' + cta.id]);
        this.alertService.success('CTA Added');
        this.saving = false;
      }, (error) => {
        this.alertService.error(error.message);
      });
    }
  }

  delete() {
    this.service.deleteCta(this.cta.id).subscribe(() => {
      this.router.navigate(['/ctas']);
      this.alertService.success('CTA Deleted');
    }, (error) => {
      this.alertService.error(error.message);
    });
  }


  preview() {
    this.router.navigate(['/ctas/custom-form/stats/', this.cta.id]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
