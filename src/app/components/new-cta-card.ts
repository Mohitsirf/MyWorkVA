import {Component, Input} from '@angular/core';
import {CtaType, getCtaIcon, getCtaTitle} from '../models/cta';

@Component({
  selector: 'va-new-cta-card',
  template: `
    <mat-card matRipple fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="20px"
              on-mouseenter="hover = true" on-mouseleave="hover = false">
      <mat-icon fxFlexAlign="center center">{{getCtaIcon(typeId)}}</mat-icon>
      <mat-card-title>
        {{getCtaTitle(typeId)}}
      </mat-card-title>
      <div class="hover" *ngIf="hover" fxLayoutAlign="center center">
        <p>{{getCtaDescription()}}</p>
      </div>
    </mat-card>
  `,
  styles: [`

    :host {
      display: flex;
      align-items: stretch;
      min-width: 200px;
      min-height: 200px;
      cursor: pointer;
    }

    mat-card {
      position: relative;
      flex-grow: 1;
    }

    mat-card-title {
      text-align: center;
    }

    mat-icon {
      font-size: 60px;
      height: 60px;
      width: 60px;
    }

    .hover {
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.8);
    }
    
    .hover p {
      text-align: center;
      color: white;
    }
  `]
})

export class NewCtaCardComponent {
  @Input() typeId: number;
  hover = false;

  getCtaTitle = getCtaTitle;
  getCtaIcon = getCtaIcon;

  getCtaDescription() {
    switch (this.typeId) {
      case CtaType.AUTO_FORWARD:
        return 'When a video ends, viewer is automatically taken to any webpage of your choosing.';
      case CtaType.TAP_TO_CALL:
        return 'When a video ends, viewer is prompted to call the phone number of your choosing.';
      case CtaType.CUSTOM_FORM:
        return 'When a video ends, viewer will be able to fill out a form of your customly defined fields.';
      case CtaType.DOWNLOAD_FILE:
        return 'When a video ends, viewer is able download a document of your choosing.';
      case CtaType.EMAIL_ME:
        return 'When a video ends, viewer is prompted to email you and can do so directly from the video';
      case CtaType.CUSTOM_HTML:
        return 'For advance use, you can enter your own HTML to create your own custom CTA. For example, the HTML' +
          'of a Buy Button of one of your Shopify products.';
      default:
        return '';
    }
  }
}
