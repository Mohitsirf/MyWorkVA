import {Component, OnDestroy, OnInit} from '@angular/core';
import {Intercom} from 'ng-intercom';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {User} from '../models/user';
import {DateUtils} from '../utils/date';
import {YoutubeService} from '../services/youtube';

@Component({

  selector: 'va-app',
  template: `
    <router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  private alive = false;

  // injecting YoutubeService here just so that it's initiated by the time it's needed later
  constructor(private intercom: Intercom, private store: Store<State>, private service: YoutubeService) {
  }

  ngOnInit() {
    this.alive = true;
    this.store.select(getUser).startWith(null).pairwise().takeWhile(() => this.alive).subscribe(value => {
      const lastUser = value[0];
      const currentUser = value[1];

      if (!lastUser || !currentUser) {
        this.intercom.shutdown();
      }

      if (!currentUser) {
        this.intercom.boot();
      } else if (!lastUser) {
        this.intercom.boot(this.getIntercomConfig(currentUser));
      } else {
        this.intercom.update(this.getIntercomConfig(currentUser));
      }
    });
  }

  private getIntercomConfig(user: User) {
    return {
      user_id: user.id,
      name: user.first_name + ' ' + user.last_name,
      email: user.email,
      plan: user.stripe_plan,
      created_at: DateUtils.timestampFromString(user.created_at)
    };
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
