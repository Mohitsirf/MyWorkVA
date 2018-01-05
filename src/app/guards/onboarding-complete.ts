import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {getUser, State} from '../reducers/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OnboardingCompleteGuard implements CanActivate {

  constructor(private router: Router, private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.store.select(getUser).map(user => {
      const currentStep = user.meta && user.meta.onboarding ? user.meta.onboarding : 0;
      if (currentStep === 3) {
        return true;
      }

      const nextStep = currentStep + 1;

      console.log('nextStep is ' + nextStep);

      if (nextStep === 1) {
        this.router.navigate(['/onboard']);
      } else {
        this.router.navigate(['onboard', 'step', nextStep]);
      }
      return false;
    });
  }
}
