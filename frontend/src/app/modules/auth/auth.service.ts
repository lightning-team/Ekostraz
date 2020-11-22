import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';

import { environment } from '@environment';
import { EkoRoutePaths } from '../../eko-route-paths';

import { AuthUrlsFactory } from './auth-urls.factory';
import { AzureUser, RawUserResponse, User } from './user.model';

const USER_MOCK: User = {
  email: 'kazik.staszewski@kult.pl',
  name: 'Kazik',
  surname: 'Staszewski',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User>(null);

  user$ = this.userSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(user => !!user));

  constructor(private router: Router, private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(userData =>
        !!userData
          ? of(true)
          : this.fetchCurrentUser().pipe(
              mapTo(true),
              catchError(e => of(false)),
            ),
      ),
      take(1),
    );
  }

  navigateToLoginPage(previousUrl?: string): void {
    const extras = previousUrl ? { queryParams: { previousUrl } } : undefined;
    this.router.navigate([EkoRoutePaths.Login], extras);
  }

  fetchCurrentUser(): Observable<User> {
    const useMockUser = environment.useMockUser;
    const nextUser = user => this.userSubject.next(user);

    if (environment.isLocalhost() || useMockUser) {
      return useMockUser ? of(USER_MOCK).pipe(tap(nextUser)) : throwError('user mock not used');
    }

    return this.http.get<RawUserResponse[]>(AuthUrlsFactory.meUrl).pipe(
      map(rawUsers => new AzureUser(rawUsers[0])),
      tap(nextUser),
    );
  }

  resetUser() {
    this.userSubject.next(null);
  }
}
