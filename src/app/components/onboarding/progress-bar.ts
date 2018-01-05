import {Component, Input} from '@angular/core';

@Component({
  selector: 'va-progress-bar',
  template: `
    <div class="reg-progress">
      <ol class="reg-progress__steps reg-progress__steps--medium">
        <li [class.is-active]="stepNo === 1" [class.is-complete]="stepNo > 1" data-step="1">
          Link Youtube Account
        </li>
        <li [class.is-active]="stepNo === 2" [class.is-complete]="stepNo > 2"  data-step="2">
          Link an Email Account
        </li>
        <li [class.is-active]="stepNo === 3" [class.is-complete]="stepNo > 3" data-step="3" class="reg-progress__steps--last">
          Add a CTA
        </li>
      </ol>
    </div>
  `,
  styles: [`
    .reg-progress {
      width: 100%;
      padding-top: 10px;
      background-color: rgba(255, 255, 255, 0.26);
    }

    .reg-progress__steps {
      list-style: none;
      margin: 0;
      padding: 0;
      display: table;
      table-layout: fixed;
      width: 100%;
      color: #849397;
    }

    .reg-progress__steps > li {
      position: relative;
      display: table-cell;
      text-align: center;
      font-size: 0.8em;
    }

    .reg-progress__steps > li:before {
      content: attr(data-step);
      display: block;
      margin: 0 auto;
      background: #DFE3E4;
      width: 3em;
      height: 3em;
      text-align: center;
      margin-bottom: 0.25em;
      line-height: 3em;
      border-radius: 100%;
      position: relative;
      z-index: 1000;
    }

    .reg-progress__steps > li:after {
      content: '';
      position: absolute;
      display: block;
      background: #DFE3E4;
      width: 100%;
      height: 0.5em;
      top: 1.25em;
      left: 50%;
      margin-left: 1.5em \\9;
      z-index: -1;
    }

    .reg-progress__steps > li:last-child:after {
      display: none;
    }

    .reg-progress__steps > li.is-complete {
      color: #2ECC71;
    }

    .reg-progress__steps > li.is-complete:before, .reg-progress__steps > li.is-complete:after {
      color: #FFF;
      background: #2ECC71;
    }

    .reg-progress__steps > li.is-active {
      color: #3498DB;
    }

    .reg-progress__steps > li.is-active:before {
      color: #FFF;
      background: #3498DB;
    }

    /**
     * Needed for IE8
     */
    .reg-progress__steps--last:after {
      display: none !important;
    }

    /**
     * Size Extensions
     */
    .reg-progress__steps--medium {
      font-size: 1.5em;
    }

    .reg-progress__steps--large {
      font-size: 2em;
    }

    /**
     * Some Generic Stylings
     */
    *, *:after, *:before {
      box-sizing: border-box;
    }

    h1 {
      margin-bottom: 1.5em;
    }

    .reg-progress__steps {
      margin-bottom: 3em;
    }

    a {
      color: #3498DB;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

  `]
})

export class ProgressBarComponent {
  @Input() stepNo: number;

}
