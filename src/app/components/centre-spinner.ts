import {Component, HostBinding} from '@angular/core';

@Component({
    selector: 'va-center-spinner',
    template: `
        <mat-spinner class="spinner" color="accent"></mat-spinner>
    `,
    styles: [``]
})

export class CentreSpinnerComponent {
    @HostBinding('class') overlay = 'overlay';
}
