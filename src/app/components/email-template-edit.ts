import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TemplateEditorComponent} from './template-editor';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material';

@Component({
  selector: 'va-edit-email-template',
  template: `
    <form [formGroup]="form" class="bgPrimary100 controls"
          fxLayout="row" fxLayoutAlign="start center" (ngSubmit)="form.valid && saveNext()" novalidate>
      <div fxLayout="row" fxLayoutAlign="start center" matTooltip="Gif creation under process. May take few minutes."
           [matTooltipDisabled]="gifAvailable">
        <mat-slide-toggle [checked]="includeGif && gifAvailable" [disabled]="!gifAvailable"
                          (change)="gifToggleChange($event)">
          Use gif of video in email
        </mat-slide-toggle>
        <mat-spinner *ngIf="!gifAvailable" style="margin-left: 10px" [diameter]="30" [strokeWidth]="4"></mat-spinner>
      </div>
      <span fxFlex="1 1 auto"></span>
      <mat-form-field fxFlex="400px">
        <input matInput placeholder="Title" formControlName="title">
        <mat-hint>This is for your internal use only. Not visible to others</mat-hint>
        <mat-error>Title is required</mat-error>
      </mat-form-field>
      <button mat-raised-button color="accent"> Save & Next</button>
    </form>
    <va-template-editor #editor [html]="html"></va-template-editor>
  `,
  styles: [`
    mat-spinner {
      margin-right: 20px;
    }

    mat-form-field {
      margin-right: 15px;
    }

    .controls {
      height: 80px;
      padding-right: 15px;
      padding-left: 15px;
    }`]
})

export class EmailTemplateEditComponent implements OnInit {
  @ViewChild('editor') editor: TemplateEditorComponent;
  @Input() html: string;
  @Input() title: string;
  @Input() includeGif: boolean;
  @Input() gifAvailable: boolean;
  @Output() save = new EventEmitter<string>();
  @Output() gifToggle = new EventEmitter<boolean>();
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({title: new FormControl(this.title, [Validators.required])});
  }

  gifToggleChange(value: MatSlideToggleChange) {
    this.gifToggle.next(value.checked);
  }

  saveNext() {
    this.save.next(this.form.get('title').value);
  }

  getHtml() {
    return this.editor.getHtml();
  }
}
