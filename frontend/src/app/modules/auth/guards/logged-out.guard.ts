import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: AuthModule,
})
export class LoggedOutGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.isLoggedIn$.pipe(
            map(isUserLoggedIn => {
                if (isUserLoggedIn) {
                    this.router.navigate(['interwencje/zglos']);
                    return false;
                } else {
                    return true;
                }
            })
        );
    }
}
