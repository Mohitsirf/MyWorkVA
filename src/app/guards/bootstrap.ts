import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {VaetasService} from '../services/vaetas';
import {Store} from '@ngrx/store';
import {accountsLoaded, getCtasLoaded, getRedirectUrl, getVideosLoaded, loggedIn, State} from '../reducers/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BootstrapGuard implements CanActivate {

  constructor(private router: Router, private service: VaetasService, private store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {

    if (!this.service.hasLoginToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    let redirectUrl: string;
    this.store.select(getRedirectUrl).subscribe((url) => redirectUrl = url || '/videos');
    const loggedIn$ = this.store.select(loggedIn);
    const videosLoaded$ = this.store.select(getVideosLoaded);
    const ctasLoaded$ = this.store.select(getCtasLoaded);
    const accountsLoaded$ = this.store.select(accountsLoaded);

    return loggedIn$.combineLatest(videosLoaded$, ctasLoaded$, accountsLoaded$,
      (loggedIn, videosLoaded, ctasLoaded, accountsLoaded) => {
        return loggedIn && videosLoaded && ctasLoaded && accountsLoaded;
      }).map((alreadyBootstraped) => {

      if (alreadyBootstraped) {
        this.router.navigateByUrl(redirectUrl);
      }

      return !alreadyBootstraped;
    });
  }
}
