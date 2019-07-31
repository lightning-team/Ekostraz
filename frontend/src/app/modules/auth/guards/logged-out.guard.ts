import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {AuthModule} from '../auth.module';
import {AuthService} from '../auth.service';

@Injectable({
    providedIn: AuthModule,
})
export class LoggedOutGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.isLoggedIn$.pipe(
            take(1),
            tap(isLoggedIn => isLoggedIn ? this.router.navigate(['interwencje/zglos']) : null),
            map(isLoggedIn => !isLoggedIn),
        );
    }
}
