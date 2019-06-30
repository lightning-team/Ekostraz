import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInMemberGuard implements CanActivate  {
  canActivate() {
    return true;
  }
}
