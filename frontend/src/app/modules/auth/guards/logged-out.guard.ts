import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { EkoRoutePaths } from '../../../eko-route-paths';
import { InterventionsRoutePaths } from '../../interventions/interventions-routing.module';

@Injectable({
  providedIn: AuthModule,
})
export class LoggedOutGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap(isLoggedIn =>
        isLoggedIn ? this.router.navigate([EkoRoutePaths.Interventions, InterventionsRoutePaths.Report]) : null,
      ),
      map(isLoggedIn => !isLoggedIn),
    );
  }
}
