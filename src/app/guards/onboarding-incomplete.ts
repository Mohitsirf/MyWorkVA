import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OnboardingIncompleteGuard implements CanActivate {

  constructor(private router: Router, private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.store.select(getUser).map(user => {
      if (!user.meta || user.meta.onboarding !== 3) {
        return true;
      }

      this.router.navigate(['emails']);
      return false;
    });
  }
}
