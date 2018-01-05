/**
 * Created by jatinverma on 8/27/17.
 */
import {Component, Input} from '@angular/core';

@Component({
  selector: 'va-email-account-card',
  template: `
    <mat-card fxLayout="column" fxLayoutAlign="center center" fxLayoutWrap fxLayoutGap="20px"
             [class.selected]="selected">
      <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
        <img src="/assets/images/{{account.type.slug}}.png"
             height="120" style="max-width: 202px" fxFlexAlign="center center"/>
        <div class="overlay" *ngIf="selected"></div>
        <mat-icon *ngIf="selected">check</mat-icon>
        <span>{{account.title | truncate:25}}</span>
      </div>
    </mat-card>
  `,
  styles: [`

    mat-card {
      position: relative;
      height: 200px;
      width: 250px;
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
    }
  `]
})


export class SendEmailAccountCardComponent {
  @Input() account: Account;
  @Input() selected: false;
}
