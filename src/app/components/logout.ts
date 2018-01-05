import {Component, OnInit} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';

@Component({
    selector: 'va-logout',
    template: ``,
    styles: []
})
export class LogoutComponent implements OnInit {


    constructor(private service: VaetasService, private router: Router) {
    }

    ngOnInit() {
        this.service.logout();
        this.router.navigate(['/login']);
    }
}
