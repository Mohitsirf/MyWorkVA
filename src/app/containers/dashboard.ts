import {Component} from '@angular/core';

@Component({
  selector: 'va-dashboard',
  template: `
    <va-layout>
      <router-outlet></router-outlet>
    </va-layout>
  `,
  styles: []
})
export class DashboardComponent {
}
