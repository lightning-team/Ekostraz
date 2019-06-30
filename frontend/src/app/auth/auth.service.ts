import { Injectable } from '@angular/core';
import { AuthModule } from './auth.module';
import { Router } from '@angular/router';

@Injectable({
  providedIn: AuthModule,
})
export class AuthService {
  private user_: any = null;

  constructor(private router: Router) { }

  isLoggedIn() {
    return !this.user_;
  }

  logout() {
    this.user_ = null;
    this.router.navigate(['']);
  }
}
