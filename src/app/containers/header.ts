import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {User} from '../models/user';
import {VaetasService} from '../services/vaetas';

@Component({
  selector: 'va-header',
  template: `
    <mat-toolbar color="primary">
      <div fxLayoutAlign="start center" fxFlex="100%">
        <img width="60" class="logo" (click)="home()" src="/assets/images/logo.png">
        <button id="accounts_link" mat-button routerLink="/accounts" routerLinkActive="selected">Accounts</button>
        <button id="ctas_link" mat-button routerLink="/ctas" routerLinkActive="selected">Call To Actions</button>
        <button id="videos_link" mat-button routerLink="/videos" routerLinkActive="selected">Videos</button>
        <button id="emails_link" mat-button routerLink="/emails" routerLinkActive="selected">Emails</button>
        <button id="templates_link" mat-button routerLink="/templates" routerLinkActive="selected">Templates</button>
        <span fxFlex="1 1 auto"></span>
        <button *ngIf="!user.stripe_plan" mat-button routerLink="/upgrade" color="accent">Buy Pro!</button>
        <button mat-button type="button" [matMenuTriggerFor]="userSettingsMenu">
          {{username | titlecase}}
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <mat-menu [overlapTrigger]="false" #userSettingsMenu="matMenu">
      <button mat-menu-item (click)="settingsButtonTapped()">Settings</button>
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
  `,
  styles: [`
    mat-toolbar {
      padding: 10px;
    }

    button.selected {
      border-bottom: 3px solid white;
    }

    .logo {
      margin-right: 20px;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  username: string;
  alive = true;

  constructor(private router: Router, private store: Store<State>, private service: VaetasService) {
  }

  ngOnInit() {

    this.store.select(getUser).filter(user => !!user).takeWhile(() => this.alive).subscribe(user => {
      this.user = user;
      this.username = user.first_name + ' ' + user.last_name;
    });
  }

  logout() {
    this.router.navigate(['/logout']);
  }

  home() {
    this.router.navigate(['/videos']);
  }

  settingsButtonTapped() {
    this.router.navigate(['/settings']);
  }

  updateMeta(user: User) {
    let data = {};
    if (user.meta) {
      data = {...user.meta};
    }
    data['tour'] = true;
    this.service.updateUserDetails({meta: data}).subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
