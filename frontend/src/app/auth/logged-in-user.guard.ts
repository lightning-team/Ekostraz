import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class LoggedInUserGuard implements CanLoad {
  canLoad() {
    return true;
  }
}
