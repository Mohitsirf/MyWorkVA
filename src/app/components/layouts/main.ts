import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'va-layout',
    template: `
        <va-header></va-header>
        <ng-content></ng-content>
    `,
    styles: []
})
export class LayoutMainComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}