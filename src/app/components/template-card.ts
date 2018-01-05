import {Component, Input} from '@angular/core';
import {Template} from '../models/template';

@Component({
  selector: 'va-template-card',
  template: `
    <div fxLayoutAlign="start stretch" fxLayoutWrap fxLayoutGap="20px">
      <mat-card  fxLayout="column" fxLayoutAlign="start center" [class.selected]="selected">
        <va-template-thumbnail [html]="template.html"></va-template-thumbnail>
        <h4>{{template.name}}</h4>
        <div class="overlay" *ngIf="selected"></div>
        <mat-icon *ngIf="selected">check</mat-icon>
      </mat-card>
    </div>`,
  styles: [`    

    mat-card {
      margin-bottom: 20px;
      min-width: 200px;
      cursor: pointer;
    }

    mat-icon {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 50px;
      height: 50px;
      width: 50px;
      background: #519bd9;
      color: white;
    }
    .selected {
      border: 4px solid #519bd9;
    }

    .overlay {
      background-color: rgba(81, 155, 217, 0.3);
    }`]
})

export class TemplateCardComponent {
  @Input() template: Template;
  @Input() selected = false;
}
