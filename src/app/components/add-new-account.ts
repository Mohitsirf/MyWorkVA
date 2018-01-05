import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {getAccounts, State} from '../reducers/index';
import {Router} from '@angular/router';

@Component({
  selector: 'va-add-new-account',
  template: `
    <div style="margin-top: 30px" fxLayoutAlign="center center" fxLayoutWrap>
      <h1 style="color: #64a9df">Add a New Account</h1>
    </div>
    <div fxLayoutAlign="center center">
      <va-account-list></va-account-list>
    </div>
  `,
  styles: [`

  `]
})

export class AddNewAccountComponent implements OnInit, OnDestroy {

  alive = true;

  constructor(private store: Store<State>, private router: Router) {
  }

  ngOnInit() {
    this.store.select(getAccounts).takeWhile(() => this.alive).subscribe(accounts => {
      if (accounts.length > 0) {
        this.router.navigate(['accounts']);
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
