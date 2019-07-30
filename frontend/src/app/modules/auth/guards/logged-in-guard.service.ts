import {Injectable} from '@angular/core';
import {CanActivateChild, CanLoad, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {AuthModule} from '../auth.module';
import {AuthService} from '../auth.service';

@Injectable({
    providedIn: AuthModule,
})
export class LoggedInGuard implements CanLoad, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canLoad(): Observable<boolean> {
        return this.isLoggedIn();
    }

    canActivateChild(): Observable<boolean> {
        return this.isLoggedIn();
    }

    private isLoggedIn() {
        return this.authService.isLoggedIn$.pipe(
            take(1),
            tap(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(['zaloguj']);
                }
            })
        );
    }
}
