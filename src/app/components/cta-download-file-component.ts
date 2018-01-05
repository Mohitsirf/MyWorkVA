import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Cta, CtaType} from '../models/cta';
import {VaetasService} from '../services/vaetas';
import {AlertService} from '../services/alert';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

@Component({
  selector: 'va-cta-download-file',
  template: `
    <div fxLayout="column" fxLayoutGap="10px">
      <h1>
        <mat-icon>file_download</mat-icon>
        Download File
      </h1>
      <form [formGroup]="form" fxLayoutGap="10px" fxLayout="column" (ngSubmit)="form.valid && check()">
        <input type="file" (change)="onFileSelected($event)" accept="image/*,.pdf" #fileInput hidden/>

        <div [hidden]="(!file && !cta) || sizeLimitExceeded">
          <div fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="start center">
            <a [href]="fileUrl | safeUrl" target="_blank" [class.no-url]="fileUrl === 'javascript:void(0)'">
              <img #previewImg height="150px"/>
            </a>
            <span fxFlexAlign="center">{{fileName}}</span>
            <button mat-raised-button type="button" fxFlexAlign="center" color="primary" (click)="selectFile()">
              <mat-icon>cached</mat-icon>
              <span>Change</span>
            </button>
          </div>
        </div>

        <div fxLayout="column" fxLayoutGap="10px" fxLayoutAlign="start center"
             *ngIf="(!file && !cta) || sizeLimitExceeded">
          <span>Select a file to upload</span>
          <button mat-raised-button type="button" color="accent" (click)="selectFile()">
            <mat-icon>cloud_upload</mat-icon>
            <span>Select</span>
          </button>
        </div>

        <mat-error *ngIf="noFileSelected && !sizeLimitExceeded" style="text-align: center">Select a file</mat-error>
        <mat-error *ngIf="sizeLimitExceeded" style="text-align: center">File can be 25MB max</mat-error>
        <mat-form-field>
          <input matInput placeholder="Title" formControlName="title" required>
          <mat-error>Provide title for the CTA</mat-error>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Top Text" formControlName="top_text">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Bottom Text" formControlName="bottom_text">
        </mat-form-field>

        <div fxLayout="row" fxLayoutAlign="end center">
          <mat-spinner fxLayoutAlign="center center" color="accent" *ngIf="saving" [diameter]="30"
                       [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="saving" type="submit">
            Save
          </button>
          <button mat-raised-button color="primary" type="button" (click)="cancelButtonPressed()">Cancel</button>
          <button *ngIf="cta" mat-raised-button color="warn" type="button" (click)="delete(cta.id)">Delete</button>
        </div>
      </form>
    </div>
    <va-center-spinner *ngIf="loading"></va-center-spinner>
  `,
  styles: [`
    mat-icon {
      font-size: 24px;
      height: 24px;
      width: 24px;
      margin-right: 10px;
    }

    button {
      margin-right: 5px;
    }

    mat-form-field {
      width: 100%;
    }

    a.no-url {
      cursor: default;
    }
  `]
})

export class DownloadFileCtaComponent implements OnInit, OnDestroy {
  form: FormGroup;
  noFileSelected = false;
  sizeLimitExceeded = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('previewImg') previewImg: ElementRef;
  file: File;
  fileName: string;
  fileUrl: string;
  saving = false;
  loading = false;
  alive = true;

  ngOnInit() {
    let topText = null;
    let bottomText = null;
    let title = null;
    if (this.cta) {
      this.fileUrl = this.cta.config.file_url;
      const extension = this.fileUrl.split('.').pop();
      this.previewImg.nativeElement.src = (extension === 'pdf') ? '/assets/images/pdf-icon.png' : this.fileUrl;
      title = this.cta.title;
      topText = this.cta.top_text;
      bottomText = this.cta.bottom_text;
    }

    this.form = new FormGroup({
      'title': new FormControl(title, [Validators.required]),
      'config': new FormGroup({}),
      'top_text': new FormControl(topText),
      'bottom_text': new FormControl(bottomText)
    });
  }

  constructor(private dialog: MatDialogRef<DownloadFileCtaComponent>, @Inject(MAT_DIALOG_DATA) private cta: Cta,
              private service: VaetasService, private alertService: AlertService) {

  }

  check() {
    if (this.noFileSelected || this.sizeLimitExceeded) {
      return;
    }

    this.save();
  }

  save() {
    const data = this.form.value;
    data['type_id'] = CtaType.DOWNLOAD_FILE;

    this.saving = true;

    if (this.file) {
      this.service.storeDoccument({title: this.fileName, file: this.file})
        .subscribe((document) => {
          data.config['file_url'] = document.url;
          this.addOrUpdateCta(data);
        });
    } else {
      data.config['file_url'] = this.cta.config.file_url;
      this.updateCta(this.cta.id, data);
    }
  }

  addOrUpdateCta(data: any) {
    if (this.cta) {
      this.updateCta(this.cta.id, data);
    } else {
      this.addCta(data);
    }
  }

  updateCta(ctaId: number, data: any) {
    this.service.updateCta(ctaId, data).subscribe((cta) => {
      this.alertService.success('CTA Updated');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.saving = false;
    });
  }

  addCta(data: any) {
    this.service.storeCta(data).subscribe((cta) => {
      this.alertService.success('CTA Added');
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.saving = false;
    });
  }

  cancelButtonPressed() {
    this.dialog.close();
  }

  delete(id: number) {
    this.loading = true;
    this.service.deleteCta(id).subscribe(() => {
      this.alertService.success('CTA Deleted');
      this.loading = false;
      this.dialog.close();
    }, (error) => {
      this.alertService.error(error.message);
      this.loading = false;
    });
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event) {
    const file = event.srcElement.files[0];
    console.log(file.size);
    if (file.size > MAX_FILE_SIZE) {
      this.noFileSelected = true;
      this.sizeLimitExceeded = true;
      return;
    }

    this.file = file;
    this.fileUrl = 'javascript:void(0)';
    this.previewImg.nativeElement.src =
      (file.type === 'application/pdf') ? '/assets/images/pdf-icon.png' : window.URL.createObjectURL(this.file);
    this.fileName = this.file.name;
    this.noFileSelected = false;
    this.sizeLimitExceeded = false;
  }


  ngOnDestroy() {
    this.alive = false;
  }
}
