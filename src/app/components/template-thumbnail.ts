import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DEFAULT_LOGO_URL, TRANSPARENT_IMAGE_URL} from '../utils/constants';
import {StringUtils} from '../utils/string';

@Component({
  selector: 'va-template-thumbnail',
  template: `
    <div class="preview" #container></div>
  `,
  styles: [`
    .preview {
      width: 800px;
      height: 800px;
      -webkit-transform: scale(.25);
      -ms-transform: scale(.25);
      transform: scale(.25);
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      transform-origin: 0 0;
      overflow-y: hidden;
      overflow-x: hidden;
      border: 10px solid black;
      margin-right: -600px;
      margin-bottom: -600px;
    }
  `]
})

export class TemplateThumbnailComponent implements OnInit {
  @Input() html: string;
  @Input() showDefaultLogo = true;
  @ViewChild('container') htmlContainer: ElementRef;

  ngOnInit(): void {
    const html = this.showDefaultLogo ? this.html : StringUtils.replaceAll(this.html, DEFAULT_LOGO_URL, TRANSPARENT_IMAGE_URL);
    const shadow = this.htmlContainer.nativeElement.attachShadow({mode: 'open'});
    shadow.innerHTML = '<div style="pointer-events: none">' + html + '</div>';
    shadow.querySelectorAll('a').forEach(x => x.setAttribute('href', ''));
  }


}
