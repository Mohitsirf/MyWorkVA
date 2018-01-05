import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {fonts, URL_REGEX} from '../utils/constants';
import {AlertService} from '../services/alert';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'va-template-editor',
  template: `
    <va-center-spinner *ngIf="showSpinner"></va-center-spinner>
    <div class="bgPrimary50 sidebar" fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="25px">
      <input type="file" (change)="onLogoSelected($event)" accept="image/*" #fileInput hidden/>
      <button mat-raised-button fxFlexAlign="center" color="accent" (click)="fileInput.click()">
        <mat-icon>cached</mat-icon>
        <span>Change Logo</span>
      </button>
      <label *ngIf="colorFields.length > 0" style="font-size: 20px">BACKGROUNDS</label>
      <div fxFlex="0 0 auto" fxLayout="row" *ngFor="let c of colorFields">
        <label fxFlex>{{c.getAttribute('name') + "  "}}</label>
        <input style="background-color: #6eb1e3" fxFlex
               [(colorPicker)]="c.style.background"
               [style.background]="c.style.background"
               [value]="c.style.background">
      </div>
      <hr>
      <label *ngIf="textFields.length > 0" style="font-size: 20px;">TEXTS</label>
      <div fxFlex="0 0 auto" fxLayout="row" fxLayoutGap="10px" fxLayoutAlign="end center"
           *ngFor="let t of textFields; let i = index">
        <label fxFlex>{{t.getAttribute('name')}}</label>
        <input fxFlex="0 0 25px" [(colorPicker)]="t.style.color"
               [style.background]="t.style.color">
        <mat-select fxFlex="0 0 120px" placeholder="Font Family" style="text-align: right;"
                    [ngModel]="initialFonts[i]" (change)="t.style.fontFamily=($event.value)">
          <mat-option [value]="initialFonts[i]">{{ initialFonts[i] }}</mat-option>
          <mat-option *ngFor="let font of allFonts | filterStrings:[initialFonts[i]]" [value]="font">{{ font }}
          </mat-option>
        </mat-select>
        <mat-form-field style="height: 50px" fxFlex="0 0 70px">
          <input matInput type="number" placeholder="Font Size"
                 [ngModel]="initialFontSizes[i]"
                 (ngModelChange)="onFontSizeChange(t, $event)">
        </mat-form-field>
      </div>

      <label *ngIf="linkFields.length > 0" style="font-size: 20px;margin-bottom: -10px">LINKS</label>
      <div div fxFlex="0 0 auto" [formGroup]="formGroup">
        <div fxFlex="0 0 auto" fxLayout="row" fxLayoutAlign="end center" formArrayName="controls"
             *ngFor="let c of linkFields; let i = index">
          <label fxFlex>{{c.getAttribute('name') + "  "}}</label>
          <mat-form-field style="width: 100%;">
            <input #link matInput placeholder="url" [formControlName]="i">
            <mat-error>Please provide a valid url</mat-error>
          </mat-form-field>
        </div>
      </div>

    </div>
    <div class="bgAccent50 template-container" fxFlex #htmlContainer fxLayoutAlign="center start"></div>
  `,
  styles: [`
    :host {
      display: flex;
      box-sizing: border-box;
      flex-direction: row;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      min-height: 400px;
      overflow-y: hidden;
    }

    .template-container {
      overflow-y: scroll;
    }

    .sidebar {
      width: 400px;
      padding: 10px;
      overflow-y: scroll;
    }

    input, mat-select, mat-form-field {
      margin-left: 10px;
    }

    color-picker {
      margin-right: -10px;
    }

  `]
})
export class TemplateEditorComponent implements OnInit {
  @ViewChild('htmlContainer') htmlContainer: ElementRef;
  colorFields: NodeListOf<Element>;
  textFields: NodeListOf<Element>;
  linkFields: NodeListOf<Element>;
  controls: FormArray;
  formGroup: FormGroup;
  logoField: any;
  initialFonts: string[];
  initialFontSizes: number[];
  shadow: ShadowRoot;
  showSpinner = false;
  allFonts = fonts;
  private _html: string;

  @Input()
  set html(data: string) {
    this._html = data;
    this.setupEditor();
  }

  constructor(private service: VaetasService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.shadow = this.htmlContainer.nativeElement.attachShadow({mode: 'open'});
    this.setupEditor();
  }

  setupEditor() {
    if (!this.shadow) {
      return;
    }
    this.shadow.innerHTML = '<div contenteditable="true">' + this._html + '</div>';
    this.colorFields = this.shadow.querySelectorAll('.color-field');
    this.textFields = this.shadow.querySelectorAll('.text-field');
    this.linkFields = this.shadow.querySelectorAll('.link-field');
    this.logoField = this.shadow.querySelector('.logo');

    const textFieldsArray = Array.prototype.slice.call(this.textFields);

    // need these two arrays to avoid change cycles when we change the font values.
    this.initialFonts = textFieldsArray.map((node) => {
      const font = node.style.fontFamily.split(',')[0].slice(0);
      if (font.startsWith('\"')) {
        return font.substring(1, font.length - 1);
      }
      return font;
    });
    this.initialFontSizes = textFieldsArray.map((node) => parseInt(node.style.fontSize, 10));

    this.controls = new FormArray([]);
    this.formGroup = new FormGroup({controls: this.controls});
    for (let i = 0; i < this.linkFields.length; i++) {
      const link = this.linkFields[i].getAttribute('href');
      const ctrl = new FormControl(link, [Validators.pattern(URL_REGEX)]);
      this.controls.push(ctrl);

      const subscription = ctrl.valueChanges.filter(() => ctrl.valid).subscribe(value => {
        let linkUrl = value;
        if (!linkUrl.startsWith('https://') && !linkUrl.startsWith('http://')) {
          linkUrl = 'http://' + linkUrl;
        }
        this.linkFields[i].setAttribute('href', linkUrl);
      });
    }
  }

  onFontSizeChange(element: any, value: number) {
    element.style.fontSize = value + 'px';
  }

  onLogoSelected(event) {
    const file = event.srcElement.files[0];
    this.showSpinner = true;
    this.service.storeDoccument({title: file.name, file: file})
      .subscribe((document) => {
          this.showSpinner = false;
          this.logoField.src = document.url;
        }, error => {
          this.alertService.error(error.message);
        }
      );
  }

  getHtml(): string {
    return this.shadow.firstElementChild.innerHTML;
  }
}
