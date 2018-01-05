import {Component, Input} from '@angular/core';

@Component({
  selector: 'va-none-cta-card',
  template: `
    <mat-card fxLayout="column" fxLayoutAlign="center center" fxLayoutWrap
              fxLayoutGap="20px" [class.selected]="selected">
      <p style="font-size: 2em">None</p>
      <div class="overlay" *ngIf="selected"></div>
      <mat-icon *ngIf="selected">check</mat-icon>
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

export class CtaNoneCardComponent {
  @Input() selected = false;
}
