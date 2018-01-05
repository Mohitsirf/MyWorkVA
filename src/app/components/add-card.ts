import {Component, Input} from '@angular/core';

@Component({
  selector: 'va-add-card',
  template: `
    <mat-card matRipple fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
      <mat-icon fxFlexAlign="center center">{{icon}}</mat-icon>
      <mat-card-title>
        <ng-content></ng-content>
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

    mat-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
    }
  `]
})

export class AddCardComponent {
  @Input() icon = 'add';
}
