import {Component} from '@angular/core';

@Component({
  selector: 'va-img-layout',
  template: `
    <div fxLayout="column" fxLayoutGap="60px">
      <div fxLayoutAlign=" center" fxFlexAlign="center">
        <img src="..//assets/images/logo-full.png" fxFlex="200px">
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class ImageLayoutComponent {
}

