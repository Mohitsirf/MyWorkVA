import {Component, OnInit} from '@angular/core';
import {VaetasService} from "../services/vaetas";

@Component({
  selector: 'va-home-page',
  template: `
    <va-img-layout>
      <div fxLayout="column" fxLayoutGap="60px">
        <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
          <span style="font-size: 40px" fxFlexAlign="center">Interactive Video Platform</span>
          <span style="font-size: 20px">An EASY,NATURAL and EFFECTIVE part of business development.</span>
        </div>
        <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
          <span>Start a free trial.No credit card required.</span>
          <div fxLayoutGap="10px">
            <mat-form-field>
              <input matInput placeholder="Your Company Email">
            </mat-form-field>
            <button mat-raised-button color="ascent">Start using it now!</button>
          </div>
        </div>
      </div>
    </va-img-layout>
  `,
  styles: []
})
export class HomePageComponent implements OnInit {

  constructor(private service: VaetasService) {
  }

  ngOnInit() {
  }

}
