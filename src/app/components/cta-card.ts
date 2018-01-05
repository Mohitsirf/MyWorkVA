/**
 * Created by jatinverma on 8/10/17.
 */
import {Component, Input} from '@angular/core';
import {AutoForwardCtaComponent} from './auto-forward-component';
import {Cta, CtaType, getCtaIcon} from '../models/cta';
import {DownloadFileCtaComponent} from './cta-download-file-component';
import {MatDialog} from '@angular/material';
import {CallCtaComponent} from './cta-call-component';
import {Router} from '@angular/router';
import {EmailMeCtaComponent} from './cta_email_me';
import {CustomHtmlCtaComponent} from './cta_custom_html';

@Component({
  selector: 'va-cta-card',
  template: `
    <mat-card fxLayout="column" fxLayoutAlign="center center" fxLayoutWrap fxLayoutGap="20px"
              (click)="edit()">
      <mat-icon fxFlexAlign="center center">{{getCtaIcon(cta.type_id)}}</mat-icon>
      <span>{{cta.title | truncate:25}}</span>
    </mat-card>
  `,
  styles: [`
    mat-card {
      position: relative;
      height: 200px;
      width: 250px;
    }

    mat-icon {
      font-size: 60px;
      height: 60px;
      width: 60px;
    }
  `]
})

export class CTACardComponent {
  @Input() cta: Cta;
  getCtaIcon = getCtaIcon;

  constructor(private dialog: MatDialog, private router: Router) {
  }

  edit() {
    if (this.cta.type_id === CtaType.CUSTOM_FORM) {
      this.router.navigate(['ctas', 'custom-form', this.cta.id]);
      return;
    }
    this.dialog.open(this.getComponentForCta(), {disableClose: true, data: this.cta}).updateSize('70%');
  }

  getComponentForCta(): any {
    switch (this.cta.type_id) {
      case CtaType.AUTO_FORWARD:
        return AutoForwardCtaComponent;
      case CtaType.TAP_TO_CALL:
        return CallCtaComponent;
      case CtaType.DOWNLOAD_FILE:
        return DownloadFileCtaComponent;
      case CtaType.EMAIL_ME:
        return EmailMeCtaComponent;
      case CtaType.CUSTOM_HTML:
        return CustomHtmlCtaComponent;
      default:
        return null;
    }
  }
}
