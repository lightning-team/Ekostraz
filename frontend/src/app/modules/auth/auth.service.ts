import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, take, tap } from 'rxjs/operators';

const SUCCESSFUL_LOGIN_ROUTE = '/interwencje';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject(null);
  isLoggedIn$: Observable<boolean> = this.user.asObservable().pipe(map(userData => !!userData));

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  navigateToLoginPage(previousUrl?: string) {
    const extras = previousUrl ? { queryParams: { previousUrl } } : undefined;
    this.router.navigate(['zaloguj'], extras);
  }

  logIn() {
    // TODO: Add proper login with API call
    this.user.next({});
    this.navigateAfterLogin();
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['']);
  }

  private navigateAfterLogin() {
    this.activatedRoute.queryParams
      .pipe(
        take(1),
        pluck('previousUrl'),
        map(previousUrl => previousUrl || SUCCESSFUL_LOGIN_ROUTE),
        tap(url => this.router.navigateByUrl(url)),
      )
      .subscribe();
  }
}
