/**
 * Created by jatinverma on 8/10/17.
 */

import {Component, Input} from '@angular/core';
@Component({
  selector : 'va-cta-lists',
  template : `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-cta-card *ngFor="let cta of ctas" [cta]="cta"></va-cta-card>
      <span *vaFlexAlignmentHack></span>
    </div>
  `,
  styles : [``]
})

export class CTAListComponent  {
  @Input() ctas;
  constructor() {

  }

}
