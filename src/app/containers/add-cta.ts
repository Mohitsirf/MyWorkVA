import {Component, OnInit} from '@angular/core';
import {VaetasService} from '../services/vaetas';

@Component({
  selector: 'va-add-cta',
  template: `
    <va-img-layout>
      <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="40px">
            <span style="font-weight: bold; font-size: 40px">
              Step 2: Add a Call to Action (CTA)
            </span>
        <div fxLayoutAlign="center start" fxLayoutGap="20px" fxLayout="column" fxLayoutGap="30px">
          <span>We provide a lot of CTA to make your videos work for you,
            but let's configure two of the simplest ones.</span>
          <span> 1. Let's show a contact form to your video viewers when they pause the video.
          We call this "Email me now!"CTA.</span>
          <span>your contact email address:
              <input placeholder="john@vaetas.com">
        </span>
          <span>2. Also let's send user to your website or product page when video ends . We call this "Auto Forward"CTA
        <input placeholder="john@vaetas.com">
        </span>
        </div>
        <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px">
          <button mat-raised-button color="accent">Ok Done !</button>
        </div>
      </div>
    </va-img-layout>
  `,
  styles: []
})
export class AddCTAPageComponent implements OnInit {

  constructor(private service: VaetasService) {
  }

  ngOnInit() {
  }

}
