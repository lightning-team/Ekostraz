import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject(null);
  isLoggedIn$: Observable<boolean> = this.user.asObservable().pipe(
      map(userData => !!userData),
  );

  constructor(private router: Router) { }

  navigateToLoginPage() {
    this.router.navigate(['zaloguj']);
  }

  logIn() {
    this.user.next({});
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['']);
  }
}
