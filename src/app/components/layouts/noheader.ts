import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'va-layout-no-header',
    template: `
        <div class="overlay">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: []
})
export class LayoutNoHeaderComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}