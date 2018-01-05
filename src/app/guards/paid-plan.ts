import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {getUser, getVideos, State} from '../reducers/index';
import {Store} from '@ngrx/store';

@Injectable()
export class PaidPlanGuard implements CanActivate {

  constructor(private router: Router, private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {


    const user$ = this.store.select(getUser);
    const videos$ = this.store.select(getVideos);

    return user$.combineLatest(videos$,
      (user, videos) => {
        return {user, videos};
      }).map(data => {
      const canActivate = !!data.user.stripe_plan || data.videos.length < 3;
      if (!canActivate) {
        this.router.navigate(['upgrade']);
      }
      return canActivate;
    });
  }
}
