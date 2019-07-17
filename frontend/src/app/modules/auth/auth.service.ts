import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthModule } from './auth.module';

@Injectable({
  providedIn: AuthModule,
})
export class AuthService {
  user = new BehaviorSubject(null);
  isLoggedIn$: Observable<boolean> = this.user.asObservable().pipe(
      map(userData => !!userData),
      shareReplay(1),
  );

  constructor(private router: Router) { }

  logIn() {
    this.user.next({});
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['']);
  }
}
