import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {RouterExtensionsService} from '../../services/router-extensions.service';

const SUCCESSFUL_LOGIN_ROUTE = '/interwencje';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject(null);
  isLoggedIn$: Observable<boolean> = this.user.asObservable().pipe(
      map(userData => !!userData),
  );

  constructor(private router: Router, private routerExtensions: RouterExtensionsService) { }

  navigateToLoginPage() {
    this.router.navigate(['zaloguj']);
  }

  logIn(fromRouteGuard = false) {
    // TODO: Add proper login with API call
    this.user.next({});
    if (fromRouteGuard) {
      this.router.navigateByUrl(this.routerExtensions.previousUrl);
    } else {
      this.router.navigateByUrl(SUCCESSFUL_LOGIN_ROUTE);
    }
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['']);
  }
}
