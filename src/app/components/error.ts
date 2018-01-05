import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'va-error',
    template: `
        <div class="overlay" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
            <mat-icon>error_outline</mat-icon>
            <span><ng-content></ng-content></span>
          <button mat-raised-button color="primary" (click)="reload.next()">Try Again
          </button>
        </div>
    `,
    styles: [`
        span {
            font-size: x-large;
        }

        mat-icon {
            font-size: 60px;
            height: 60px;
            width: 60px;
        }
    `]
})

export class ErrorComponent {
  @Output() reload = new EventEmitter();
}
