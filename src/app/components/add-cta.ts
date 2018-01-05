/**
 * Created by jatinverma on 8/6/17.
 */
import {Component, Input, OnDestroy} from '@angular/core';
import {Video} from '../models/video';
import {MatDialog} from '@angular/material';
import {AutoForwardCtaComponent} from 'app/components/auto-forward-component';
import {CallCtaComponent} from './cta-call-component';
import {DownloadFileCtaComponent} from './cta-download-file-component';
import {Store} from '@ngrx/store';
import {
  State
} from '../reducers/index';
import {VaetasService} from '../services/vaetas';
import {EmailMeCtaComponent} from './cta_email_me';
import {CustomHtmlCtaComponent} from './cta_custom_html';
import {CtaType} from '../models/cta';

@Component({
  selector: 'va-cta-list',
  template: `
    <div fxLayoutAlign="center stretch" fxLayoutWrap fxLayoutGap="20px">
      <va-new-cta-card [typeId]="CtaType.AUTO_FORWARD" (click)="openCtaForm(CtaType.AUTO_FORWARD)"></va-new-cta-card>
      <va-new-cta-card [typeId]="CtaType.EMAIL_ME" (click)="openCtaForm(CtaType.EMAIL_ME)"></va-new-cta-card>
      <va-new-cta-card [typeId]="CtaType.TAP_TO_CALL"  (click)="openCtaForm(CtaType.TAP_TO_CALL)"></va-new-cta-card>
      <va-new-cta-card [typeId]="CtaType.DOWNLOAD_FILE"  (click)="openCtaForm(CtaType.DOWNLOAD_FILE)"></va-new-cta-card>
      <va-new-cta-card [typeId]="CtaType.CUSTOM_FORM" routerLink="/ctas/custom-form"></va-new-cta-card>
      <va-new-cta-card [typeId]="CtaType.CUSTOM_HTML" (click)="openCtaForm(CtaType.CUSTOM_HTML)"></va-new-cta-card>
      <span *vaFlexAlignmentHack></span>
    </div>
  `,
  styles: [`
    span {
      width: 250px;
    }

    va-new-cta-card {
      width: 250px;
      margin-bottom: 20px;
    }`]
})

export class AddCtaPageComponent implements OnDestroy {
  @Input() videos: Video[];
  CtaType = CtaType;
  alive = true;

  constructor(private dialog: MatDialog, public store: Store<State>, public service: VaetasService) {

  }

  openCtaForm(typeId: number) {
    this.dialog.open(this.getComponentForCta(typeId), {disableClose: true}).updateSize('70%');
  }

  getComponentForCta(typeId: number): any {
    switch (typeId) {
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

  ngOnDestroy() {
    this.alive = false;
  }
}
