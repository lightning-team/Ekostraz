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

    canLoad(route, urlSegments): Observable<boolean> {
        const url = `/${urlSegments.map(segment => segment.path).join('/')}`;
        return this.isLoggedIn(url);
    }

    canActivateChild(childRoute, routerState): Observable<boolean> {
        return this.isLoggedIn(routerState.url);
    }

    private isLoggedIn(previousUrl: string) {
        return this.authService.isLoggedIn$.pipe(
            take(1),
            tap(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(['zaloguj'], {
                        queryParams: {
                            previous: previousUrl,
                        }
                    });
                }
            })
        );
    }
}
