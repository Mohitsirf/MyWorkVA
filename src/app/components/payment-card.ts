import {Component, Input} from '@angular/core';

@Component({
  selector: 'va-payment-card',
  template: `
    <div fxLayoutAlign="center start">
      <mat-card fxFlex="50%" fxFlex="30%" fxLayout="column" fxLayoutAlign=" stretch">
        <div fxLayoutAlign="space-between center">
          <span style="font-size: 30px">Vaetas Pro</span>
          <mat-button-toggle-group #group="matButtonToggleGroup">
            <mat-button-toggle value="monthly">Monthly</mat-button-toggle>
            <mat-button-toggle value="yearly">Yearly</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <hr>
        <div fxLayout="column" fxLayoutAlign=" stretch" fxFlexOffset="20px" fxLayoutGap="10px"  style="margin-right: 20px">

          <mat-form-field>
            <input matInput placeholder="Card Number">
          </mat-form-field>
          
          <div>
            <span>Expiration: </span>
            <div fxLayoutAlign="start center" fxLayoutGap="5px"  >
              <button mat-raised-button [matMenuTriggerFor]="expiry_month">month<mat-icon>arrow_drop_down</mat-icon></button>
              <mat-menu #expiry_month="matMenu">
                <button mat-menu-item>january</button>
                <button mat-menu-item>february</button>
              </mat-menu>
              <span>/</span>
              <button mat-raised-button [matMenuTriggerFor]="expiry_year">Year<mat-icon>arrow_drop_down</mat-icon></button>
              <mat-menu #expiry_year="matMenu">
                <button mat-menu-item>2016</button>
                <button mat-menu-item>2017</button>
              </mat-menu>
            </div>
          </div>
          
          <mat-form-field>
            <input matInput placeholder="CVC">
          </mat-form-field>
          
          <button mat-raised-button color="primary">Pay</button>
          
          <div fxFlexAlign="end">
            <a href="#" style="font-size: 10px">Promo code?</a>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: ['']
})

export class PaymentCardComponent {
}
