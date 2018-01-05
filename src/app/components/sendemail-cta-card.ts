import {Component, Input} from '@angular/core';
import {getCtaIcon} from '../models/cta';

@Component({
  selector : 'va-email-cta-card',
  template : `
    <mat-card fxLayout="column" fxLayoutAlign="center center" fxLayoutWrap fxLayoutGap="20px" [class.selected]="selected">
        <mat-icon class="primary" fxFlexAlign="center center">{{getCtaIcon(cta.type_id)}}</mat-icon>
        <span>{{cta.title | truncate:25}}</span>
        <div class="overlay" *ngIf="selected"></div>
        <mat-icon *ngIf="selected" class="secondary">check</mat-icon>
    </mat-card>
  `,
  styles : [`    
    mat-card {
      position: relative;
      height: 200px;
      width: 250px;
    }

    mat-icon.secondary {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 50px;
      height: 50px;
      width: 50px;
      background: #519bd9;
      color: white;
    }
    mat-icon.primary {
      position: relative;
      font-size: 60px;
      height: 60px;
      width: 60px;
    }
    .selected {
      border: 4px solid #519bd9;
    }

    .overlay {
      background-color: rgba(81, 155, 217, 0.3);
    }
  `]
})

export class SendEmailCtaCardComponent {
  @Input() cta;
  @Input() selected: false;
  getCtaIcon = getCtaIcon;
}
