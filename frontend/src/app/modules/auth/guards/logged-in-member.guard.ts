import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthModule } from '../auth.module';

@Injectable({
  providedIn: AuthModule,
})
export class LoggedInMemberGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    // TODO
    return of(true);
  }
}
