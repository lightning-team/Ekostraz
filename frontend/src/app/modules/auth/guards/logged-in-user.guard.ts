import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: AuthModule,
})
export class LoggedInUserGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
            // TODO: Add login flow later
          // this.router.navigate(['zaloguj']);
            alert('You should be logged in!');
        }
      })
    );
  }
}
