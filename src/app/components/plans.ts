import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {Plan} from '../models/user';
import {VaetasService} from '../services/vaetas';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert';
import {PaidVerificationSentComponent} from './paid-verification-sent';
import {MatDialog} from '@angular/material';
import {ResendConfirmationComponent} from './resend-confirmation';

@Component({
  selector: 'va-plans',
  template: `
    <div class="pricing-container">
      <div class="pricing-switcher">
        <p class="fieldset">
          <input type="radio" name="duration-1" value="monthly" id="monthly-1" checked>
          <label for="monthly-1">Monthly</label>
          <input type="radio" name="duration-1" value="yearly" id="yearly-1">
          <label for="yearly-1">Yearly</label>
          <span class="switch"></span>
        </p>
      </div>
      <ul class="pricing-list bounce-invert">
        <li>
          <ul class="pricing-wrapper">
            <li data-type="monthly" class="is-visible">
              <header class="pricing-header">
                <h2>VAETAS CONNECT</h2>
                <div class="price">
                  <span class="value">FREE</span>
                </div>
              </header>
              <div class="pricing-body">
                <ul class="pricing-features">
                  <li>Access to the Full Vaetas System</li>
                  <li><em>3</em> Active Videos</li>
                </ul>
              </div>
              <footer class="pricing-footer">
                <a class="select" routerLink="/signup">Sign Up</a>
              </footer>
            </li>
            <li data-type="yearly" class="is-hidden">
              <header class="pricing-header">
                <h2>VAETAS CONNECT</h2>
                <div class="price">
                  <span class="value">FREE</span>
                </div>
              </header>
              <div class="pricing-body">
                <ul class="pricing-features">
                  <li>Access to the Full Vaetas System</li>
                  <li><em>3</em> Active Videos</li>
                </ul>
              </div>
              <footer class="pricing-footer">
                <a class="select" routerLink="/signup">Sign Up</a>
              </footer>
            </li>
          </ul>
        </li>
        <li>
          <ul class="pricing-wrapper">
            <li data-type="monthly" class="is-visible">
              <header class="pricing-header">
                <h2>VAETAS PRO</h2>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="value">25</span>
                  <span class="duration">mo</span>
                </div>
              </header>
              <div class="pricing-body">
                <ul class="pricing-features">
                  <li>Access to the Full Vaetas System</li>
                  <li>Unlimited Videos</li>
                </ul>
              </div>
              <footer class="pricing-footer">
                <a class="select" (click)="subscribeMonthly()">Sign Up</a>
              </footer>
            </li>
            <li data-type="yearly" class="is-hidden">
              <header class="pricing-header">
                <h2>VAETAS PRO</h2>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="value">228</span>
                  <span class="duration">yr</span>
                </div>
              </header>
              <div class="pricing-body">
                <ul class="pricing-features">
                  <li>Access to the Full Vaetas System</li>
                  <li>Unlimited Videos</li>
                </ul>
              </div>
              <footer class="pricing-footer">
                <a class="select" (click)="subscribeAnnual()">Sign Up</a>
              </footer>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <va-center-spinner *ngIf="loading"></va-center-spinner>
  `,
  styles: [`
    :host {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #333333;
      overflow: scroll;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }

    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section, main {
      display: block;
    }

    body {
      line-height: 1;
    }

    ol, ul {
      list-style: none;
    }

    blockquote, q {
      quotes: none;
    }

    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    *,
    *::after,
    *::before {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    html {
      font-size: 62.5%;
    }

    html * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-size: 1.6rem;
      font-family: "Open Sans", sans-serif;
      color: #2d3d4f;
      background-color: #81bfe9;
    }

    a {
      text-decoration: none;
      cursor: pointer;
    }

    .pricing-container {
      width: 90%;
      max-width: 1170px;
      margin: 3em auto;
    }

    .pricing-switcher {
      text-align: center;
    }

    .pricing-switcher .fieldset {
      display: inline-block;
      position: relative;
      padding: 2px;
      border-radius: 50em;
      border: 2px solid #81bfe9;
    }

    .pricing-switcher input[type="radio"] {
      position: absolute;
      opacity: 0;
    }

    .pricing-switcher label {
      position: relative;
      z-index: 1;
      display: inline-block;
      float: left;
      width: 90px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-size: 1.4rem;
      color: #ffffff;
    }

    .pricing-switcher .switch {
      position: absolute;
      top: 2px;
      left: 2px;
      height: 40px;
      width: 90px;
      background-color: #81bfe9;
      border-radius: 50em;
      -webkit-transition: -webkit-transform 0.5s;
      -moz-transition: -moz-transform 0.5s;
      transition: transform 0.5s;
    }

    .pricing-switcher input[type="radio"]:checked + label + .switch,
    .pricing-switcher input[type="radio"]:checked + label:nth-of-type(n) + .switch {
      -webkit-transform: translateX(90px);
      -moz-transform: translateX(90px);
      -ms-transform: translateX(90px);
      -o-transform: translateX(90px);
      transform: translateX(90px);
    }

    .no-js .pricing-switcher {
      display: none;
    }

    .pricing-list {
      margin: 2em 0 0;
    }

    .pricing-list > li {
      position: relative;
      margin-bottom: 1em;
    }

    @media only screen and (min-width: 768px) {
      .pricing-list {
        margin: 3em 0 0;
      }

      .pricing-list:after {
        content: "";
        display: table;
        clear: both;
      }

      .pricing-list > li {
        width: 50%;
        float: left;
        padding-left: 5px;
        padding-right: 5px;
      }

      .has-margins .pricing-list > li {
        width: 32.3333333333%;
        float: left;
        margin-right: 1.5%;
      }

      .has-margins .pricing-list > li:last-of-type {
        margin-right: 0;
      }
    }

    .pricing-wrapper {
      position: relative;
    }

    .touch .pricing-wrapper {
      -webkit-perspective: 2000px;
      -moz-perspective: 2000px;
      perspective: 2000px;
    }

    .pricing-wrapper.is-switched .is-visible {
      -webkit-transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      transform: rotateY(180deg);
      -webkit-animation: rotate 0.5s;
      -moz-animation: rotate 0.5s;
      animation: rotate 0.5s;
    }

    .pricing-wrapper.is-switched .is-hidden {
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
      -ms-transform: rotateY(0);
      -o-transform: rotateY(0);
      transform: rotateY(0);
      -webkit-animation: rotate-inverse 0.5s;
      -moz-animation: rotate-inverse 0.5s;
      animation: rotate-inverse 0.5s;
      opacity: 0;
    }

    .pricing-wrapper.is-switched .is-selected {
      opacity: 1;
    }

    .pricing-wrapper.is-switched.reverse-animation .is-visible {
      -webkit-transform: rotateY(-180deg);
      -moz-transform: rotateY(-180deg);
      -ms-transform: rotateY(-180deg);
      -o-transform: rotateY(-180deg);
      transform: rotateY(-180deg);
      -webkit-animation: rotate-back 0.5s;
      -moz-animation: rotate-back 0.5s;
      animation: rotate-back 0.5s;
    }

    .pricing-wrapper.is-switched.reverse-animation .is-hidden {
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
      -ms-transform: rotateY(0);
      -o-transform: rotateY(0);
      transform: rotateY(0);
      -webkit-animation: rotate-inverse-back 0.5s;
      -moz-animation: rotate-inverse-back 0.5s;
      animation: rotate-inverse-back 0.5s;
      opacity: 0;
    }

    .pricing-wrapper.is-switched.reverse-animation .is-selected {
      opacity: 1;
    }

    .pricing-wrapper > li {
      background-color: #ffffff;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      outline: 1px solid transparent;
    }

    .pricing-wrapper > li::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 50px;
      pointer-events: none;
      background: -webkit-linear-gradient(right, #ffffff, rgba(255, 255, 255, 0));
      background: linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0));
    }

    .pricing-wrapper > li.is-ended::after {
      display: none;
    }

    .pricing-wrapper .is-visible {
      position: relative;
      z-index: 5;
    }

    .pricing-wrapper .is-hidden {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      -webkit-transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      transform: rotateY(180deg);
    }

    .pricing-wrapper .is-selected {
      z-index: 3 !important;
    }

    @media only screen and (min-width: 768px) {
      .pricing-wrapper > li::before {
        content: '';
        position: absolute;
        z-index: 6;
        left: -1px;
        top: 50%;
        bottom: auto;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
        height: 50%;
        width: 1px;
        background-color: #b1d6e8;
      }

      .pricing-wrapper > li::after {
        display: none;
      }

      .exclusive .pricing-wrapper > li {
        box-shadow: inset 0 0 0 3px #81bfe9;
      }

      .has-margins .pricing-wrapper > li,
      .has-margins .exclusive .pricing-wrapper > li {
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
      }

      :nth-of-type(1) > .pricing-wrapper > li::before {
        display: none;
      }

      .has-margins .pricing-wrapper > li {
        border-radius: 4px 4px 6px 6px;
      }

      .has-margins .pricing-wrapper > li::before {
        display: none;
      }
    }

    @media only screen and (min-width: 1500px) {
      .full-width .pricing-wrapper > li {
        padding: 2.5em 0;
      }
    }

    .no-js .pricing-wrapper .is-hidden {
      position: relative;
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
      -ms-transform: rotateY(0);
      -o-transform: rotateY(0);
      transform: rotateY(0);
      margin-top: 1em;
    }

    @media only screen and (min-width: 768px) {
      .exclusive .pricing-wrapper > li::before {
        display: none;
      }

      .exclusive + li .pricing-wrapper > li::before {
        display: none;
      }
    }

    .pricing-header h2 {
      padding: 0.9em 0.9em 0.6em;
      font-weight: 400;
      margin-bottom: 30px;
      margin-top: 10px;
      text-transform: uppercase;
      text-align: center;
    }

    .pricing-header {
      height: auto;
      padding: 1.9em 0 1.6em;
      pointer-events: auto;
      text-align: center;
      color: #173d50;
      background-color: transparent;
    }

    .exclusive .pricing-header {
      color: #81bfe9;
      background-color: transparent;
    }

    .pricing-header h2 {
      font-size: 2.4rem;
      letter-spacing: 2px;
    }

    .currency,
    .value {
      font-size: 3rem;
      font-weight: 300;
    }

    .duration {
      font-weight: 700;
      font-size: 1.3rem;
      color: #8dc8e4;
      text-transform: uppercase;
    }

    .exclusive .duration {
      color: #f3b6ab;
    }

    .duration::before {
      content: '/';
      margin-right: 2px;
    }

    .value {
      font-size: 5rem;
      font-weight: 300;
    }

    .currency,
    .duration {
      color: #81bfe9;
    }

    .exclusive .currency,
    .exclusive .duration {
      color: #81bfe9;
    }

    .currency {
      display: inline-block;
      margin-top: 10px;
      vertical-align: top;
      font-size: 2rem;
      font-weight: 700;
    }

    .duration {
      font-size: 1.4rem;
    }

    .pricing-body {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .is-switched .pricing-body {
      overflow: hidden;
    }

    .pricing-body {
      overflow-x: visible;
    }

    .pricing-features {
      width: 600px;
    }

    .pricing-features:after {
      content: "";
      display: table;
      clear: both;
    }

    .pricing-features li {
      width: 100px;
      float: left;
      padding: 1.6em 1em;
      font-size: 1.5rem;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pricing-features em {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .pricing-features {
      width: auto;
    }

    .pricing-features li {
      float: none;
      width: auto;
      padding: 1em;
    }

    .exclusive .pricing-features li {
      margin: 0 3px;
    }

    .pricing-features em {
      display: inline-block;
      margin-bottom: 0;
    }

    .has-margins .exclusive .pricing-features li {
      margin: 0;
    }

    .pricing-footer {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      height: 80px;
      width: 100%;
    }

    .pricing-footer {
      position: relative;
      height: auto;
      padding: 1.8em 0;
      text-align: center;
    }

    .pricing-footer::after {
      display: none;
    }

    .has-margins .pricing-footer {
      padding-bottom: 0;
    }

    .select {
      position: relative;
      z-index: 1;
      display: block;
      height: 100%;
      overflow: hidden;
      text-indent: 100%;
      white-space: nowrap;
      color: transparent;
    }

    .select {
      position: static;
      display: inline-block;
      height: auto;
      padding: 1.3em 2em;
      color: #81bfe9;
      border-radius: 8px;
      border: 2px solid #81bfe9;
      font-size: 1.2rem;
      text-indent: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all .6s;
      width: 50%;
    }

    .select:hover {
      background-color: #81bfe9;
      color: #ffffff;
    }

    .exclusive .select {
      background-color: #81bfe9;
      color: #ffffff;
    }

    .has-margins .select {
      display: block;
      padding: 1.7em 0;
      border-radius: 0 0 4px 4px;
    }

    @-webkit-keyframes rotate {
      0% {
        -webkit-transform: perspective(2000px) rotateY(0);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(200deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(180deg);
      }
    }

    @-moz-keyframes rotate {
      0% {
        -moz-transform: perspective(2000px) rotateY(0);
      }
      70% {
        -moz-transform: perspective(2000px) rotateY(200deg);
      }
      100% {
        -moz-transform: perspective(2000px) rotateY(180deg);
      }
    }

    @keyframes rotate {
      0% {
        -webkit-transform: perspective(2000px) rotateY(0);
        -moz-transform: perspective(2000px) rotateY(0);
        -ms-transform: perspective(2000px) rotateY(0);
        -o-transform: perspective(2000px) rotateY(0);
        transform: perspective(2000px) rotateY(0);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(200deg);
        -moz-transform: perspective(2000px) rotateY(200deg);
        -ms-transform: perspective(2000px) rotateY(200deg);
        -o-transform: perspective(2000px) rotateY(200deg);
        transform: perspective(2000px) rotateY(200deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(180deg);
        -moz-transform: perspective(2000px) rotateY(180deg);
        -ms-transform: perspective(2000px) rotateY(180deg);
        -o-transform: perspective(2000px) rotateY(180deg);
        transform: perspective(2000px) rotateY(180deg);
      }
    }

    @-webkit-keyframes rotate-inverse {
      0% {
        -webkit-transform: perspective(2000px) rotateY(-180deg);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(20deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(0);
      }
    }

    @-moz-keyframes rotate-inverse {
      0% {
        -moz-transform: perspective(2000px) rotateY(-180deg);
      }
      70% {
        -moz-transform: perspective(2000px) rotateY(20deg);
      }
      100% {
        -moz-transform: perspective(2000px) rotateY(0);
      }
    }

    @keyframes rotate-inverse {
      0% {
        -webkit-transform: perspective(2000px) rotateY(-180deg);
        -moz-transform: perspective(2000px) rotateY(-180deg);
        -ms-transform: perspective(2000px) rotateY(-180deg);
        -o-transform: perspective(2000px) rotateY(-180deg);
        transform: perspective(2000px) rotateY(-180deg);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(20deg);
        -moz-transform: perspective(2000px) rotateY(20deg);
        -ms-transform: perspective(2000px) rotateY(20deg);
        -o-transform: perspective(2000px) rotateY(20deg);
        transform: perspective(2000px) rotateY(20deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(0);
        -moz-transform: perspective(2000px) rotateY(0);
        -ms-transform: perspective(2000px) rotateY(0);
        -o-transform: perspective(2000px) rotateY(0);
        transform: perspective(2000px) rotateY(0);
      }
    }

    @-webkit-keyframes rotate-back {
      0% {
        -webkit-transform: perspective(2000px) rotateY(0);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(-200deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(-180deg);
      }
    }

    @-moz-keyframes rotate-back {
      0% {
        -moz-transform: perspective(2000px) rotateY(0);
      }
      70% {
        -moz-transform: perspective(2000px) rotateY(-200deg);
      }
      100% {
        -moz-transform: perspective(2000px) rotateY(-180deg);
      }
    }

    @keyframes rotate-back {
      0% {
        -webkit-transform: perspective(2000px) rotateY(0);
        -moz-transform: perspective(2000px) rotateY(0);
        -ms-transform: perspective(2000px) rotateY(0);
        -o-transform: perspective(2000px) rotateY(0);
        transform: perspective(2000px) rotateY(0);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(-200deg);
        -moz-transform: perspective(2000px) rotateY(-200deg);
        -ms-transform: perspective(2000px) rotateY(-200deg);
        -o-transform: perspective(2000px) rotateY(-200deg);
        transform: perspective(2000px) rotateY(-200deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(-180deg);
        -moz-transform: perspective(2000px) rotateY(-180deg);
        -ms-transform: perspective(2000px) rotateY(-180deg);
        -o-transform: perspective(2000px) rotateY(-180deg);
        transform: perspective(2000px) rotateY(-180deg);
      }
    }

    @-webkit-keyframes rotate-inverse-back {
      0% {
        -webkit-transform: perspective(2000px) rotateY(180deg);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(-20deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(0);
      }
    }

    @-moz-keyframes rotate-inverse-back {
      0% {
        -moz-transform: perspective(2000px) rotateY(180deg);
      }
      70% {
        -moz-transform: perspective(2000px) rotateY(-20deg);
      }
      100% {
        -moz-transform: perspective(2000px) rotateY(0);
      }
    }

    @keyframes rotate-inverse-back {
      0% {
        -webkit-transform: perspective(2000px) rotateY(180deg);
        -moz-transform: perspective(2000px) rotateY(180deg);
        -ms-transform: perspective(2000px) rotateY(180deg);
        -o-transform: perspective(2000px) rotateY(180deg);
        transform: perspective(2000px) rotateY(180deg);
      }
      70% {
        -webkit-transform: perspective(2000px) rotateY(-20deg);
        -moz-transform: perspective(2000px) rotateY(-20deg);
        -ms-transform: perspective(2000px) rotateY(-20deg);
        -o-transform: perspective(2000px) rotateY(-20deg);
        transform: perspective(2000px) rotateY(-20deg);
      }
      100% {
        -webkit-transform: perspective(2000px) rotateY(0);
        -moz-transform: perspective(2000px) rotateY(0);
        -ms-transform: perspective(2000px) rotateY(0);
        -o-transform: perspective(2000px) rotateY(0);
        transform: perspective(2000px) rotateY(0);
      }
    }
  `]
})

export class PlansComponent implements OnInit {

  handler: any;
  loading = false;
  selectedPlan: Plan;


  constructor(private service: VaetasService, private dialog: MatDialog, private router: Router, private alertService: AlertService) {
  }

  ngOnInit() {
    this.setupPricingTable();
    this.setupStripe();
  }

  setupPricingTable() {
    checkScrolling(jQuery('.pricing-body'));
    jQuery(window).on('resize', function () {
      window.requestAnimationFrame(function () {
        checkScrolling(jQuery('.pricing-body'));
      });
    });
    jQuery('.pricing-body').on('scroll', function () {
      const selected = jQuery(this);
      window.requestAnimationFrame(function () {
        checkScrolling(selected);
      });
    });

    function checkScrolling(tables) {
      tables.each(function () {
        const table = jQuery(this),
          totalTableWidth = table.children('.pricing-features').width(),
          tableViewport = table.children('.pricing-features').width();
        if (table.scrollLeft() >= totalTableWidth - tableViewport - 1) {
          table.parent('li').addClass('is-ended');
        } else {
          table.parent('li').removeClass('is-ended');
        }
      });
    }

    bouncy_filter(jQuery('.pricing-container'));

    function bouncy_filter(container) {
      container.each(function () {
        const pricing_table = jQuery(this);
        const filter_list_container = pricing_table.children('.pricing-switcher'),
          filter_radios = filter_list_container.find('input[type="radio"]'),
          pricing_table_wrapper = pricing_table.find('.pricing-wrapper');

        const table_elements = {};
        filter_radios.each(function () {
          const filter_type: any = jQuery(this).val();
          table_elements[filter_type] = pricing_table_wrapper.find('li[data-type="' + filter_type + '"]');
        });

        filter_radios.on('change', function (event) {
          event.preventDefault();
          const selected_filter: any = jQuery(event.target).val();

          show_selected_items(table_elements[selected_filter]);


          pricing_table_wrapper.addClass('is-switched').eq(0)
            .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
              hide_not_selected_items(table_elements, selected_filter);
              pricing_table_wrapper.removeClass('is-switched');
              if (pricing_table.find('.pricing-list').hasClass('bounce-invert')) {
                pricing_table_wrapper.toggleClass('reverse-animation');
              }
            });
        });
      });
    }

    function show_selected_items(selected_elements) {
      selected_elements.addClass('is-selected');
    }

    function hide_not_selected_items(table_containers, filter) {
      jQuery.each(table_containers, function (key, value) {
        if (key !== filter) {
          jQuery(this).removeClass('is-visible is-selected').addClass('is-hidden');

        } else {
          jQuery(this).addClass('is-visible').removeClass('is-hidden is-selected');
        }
      });
    }
  }

  setupStripe() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '/assets/images/logo-black-bg.png',
      locale: 'auto',
      allowRememberMe: false,
      token: token => {
        this.loading = true;
        this.service.sendPaidVerificationLink({
          email: token.email,
          credit_card_token: token.id,
          stripe_plan: this.selectedPlan
        }).subscribe(
          (response) => {
            this.dialog.open(ResendConfirmationComponent, ({
              disableClose: true, data: {
                email: token.email
              }
            }));
          },
          (error) => {
            this.alertService.error(error.message);
            this.loading = false;
          }
        );
      }
    });
  }

  subscribeMonthly() {
    this.selectedPlan = Plan.PRO_MONTHLY;
    this.handler.open({
      name: 'VAETAS PRO MONTHLY',
      description: '$25/month',
      amount: 2500
    });
  }

  subscribeAnnual() {
    this.selectedPlan = Plan.PRO_ANNUAL;
    this.handler.open({
      name: 'VAETAS PRO YEARLY',
      description: '$228/year',
      amount: 22800
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }
}
