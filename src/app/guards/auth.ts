import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {VaetasService} from '../services/vaetas';
import {Observable} from 'rxjs/Observable';
import {accountsLoaded, getCtasLoaded, getVideosLoaded, loggedIn, State} from '../reducers/index';
import {Store} from '@ngrx/store';
import {SetRedirectUrlAction} from '../actions/layout';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private service: VaetasService, private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {


    if (!this.service.hasLoginToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    const loggedIn$ = this.store.select(loggedIn);
    const videosLoaded$ = this.store.select(getVideosLoaded);
    const ctasLoaded$ = this.store.select(getCtasLoaded);
    const accountsLoaded$ = this.store.select(accountsLoaded);

    return loggedIn$.combineLatest(videosLoaded$, ctasLoaded$, accountsLoaded$,
      (loggedIn, videosLoaded, ctasLoaded, accountsLoaded) => {
        return loggedIn && videosLoaded && ctasLoaded && accountsLoaded;
      }).map((bootstraped) => {
      if (!bootstraped) {
        // navigate to bootstrap component
        this.store.dispatch(new SetRedirectUrlAction(state.url));
        this.router.navigate(['/']);
      }

      return bootstraped;
    });
  }
}
