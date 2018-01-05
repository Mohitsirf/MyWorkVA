import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {getCtas, State} from '../reducers/index';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

@Component({
  selector: 'va-add-new-cta',
  template: `
    <div style="margin-top: 30px" fxLayoutAlign="center center" fxLayoutWrap>
      <h1 style="color: #64a9df">Add a New CTA</h1>
    </div>
    <div fxLayoutAlign="center center">
      <va-cta-list></va-cta-list>
    </div>
  `,
  styles: [`

  `]
})

export class AddNewCtaComponent implements OnInit, OnDestroy {

  alive = true;

  constructor(private store: Store<State>, private router: Router) {
  }

  ngOnInit() {
    this.store.select(getCtas).takeWhile(() => this.alive).subscribe(ctas => {
      if (ctas.length > 0) {
        this.router.navigate(['ctas']);
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
