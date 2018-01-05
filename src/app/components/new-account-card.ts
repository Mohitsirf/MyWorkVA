import {Component, Input} from '@angular/core';
import {getAccountTitle} from '../models/accounts/account';

@Component({
  selector: 'va-new-account-card',
  template: `
    <mat-card matRipple fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <img src="/assets/images/{{type}}.png" fxFlexAlign="center"/>
      <mat-card-title>
        {{getAccountTitle(type)}}
      </mat-card-title>
    </mat-card>
  `,
  styles: [`

    :host {
      display: flex;
      align-items: stretch;
      min-width: 200px;
      min-height: 200px;
      cursor: pointer;
    }

    mat-card {
      flex-grow: 1;
    }

    mat-card-title {
      text-align: center;
    }
    
    img {
      height: 60px;
      width: 60px
    }
  `]
})

export class NewAccountCardComponent {
  @Input() type: string;
  getAccountTitle = getAccountTitle;
}
