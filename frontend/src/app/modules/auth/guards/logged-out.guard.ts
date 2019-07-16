import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: AuthModule,
})
export class LoggedOutGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return of(!this.authService.isLoggedIn()).pipe(
            tap(loggedOut => {
                if (!loggedOut) {
                    this.router.navigate(['']);
                }
            })
        );
    }
}
