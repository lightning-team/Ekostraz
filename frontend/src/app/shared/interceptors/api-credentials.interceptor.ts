import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

/**
 * Interceptor adding cookies to API request headers.
 */
@Injectable()
export class ApiCredentialsInterceptor implements HttpInterceptor {
  intercept = (request: HttpRequest<any>, next: HttpHandler) =>
    !environment.isLocalhost() && request.url.startsWith(environment.cloudAppUrl)
      ? next.handle(request.clone({ withCredentials: true }))
      : next.handle(request);
}
