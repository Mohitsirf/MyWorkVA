import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {VaetasService} from '../services/vaetas';

@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor(private router: Router, private service: VaetasService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.service.hasLoginToken()) {
      return true;
    }

    this.router.navigate(['/videos']);
    return false;
  }
}
