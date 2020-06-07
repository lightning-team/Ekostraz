import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '@environment';
import { AuthService } from '../../modules/auth/auth.service';

const noop = () => {};

/**
 * Interceptor adding cookies to API request headers.
 */
@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept = (request: HttpRequest<any>, next: HttpHandler) =>
    next.handle(request).pipe(tap(noop, err => this.handleUnauthorizedError(err, request.url)));

  private handleUnauthorizedError(err: Error, requestUrl: string) {
    if (err instanceof HttpErrorResponse && err.status === 401 && requestUrl.startsWith(environment.APIUrl)) {
      const currentRoute = location.hash.slice(1);
      this.authService.resetUser();
      this.authService.navigateToLoginPage(currentRoute);
    }
  }
}
