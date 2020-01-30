import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pluck, switchMap, tap } from 'rxjs/operators';
import { defer, from, Observable, of } from 'rxjs';

/**
 * Interceptor adding Azure Functions Token to request header. Used for LOCAL development only.
 */
@Injectable()
export class LocalAzureTokenInterceptor implements HttpInterceptor {
  private cachedToken: string;
  private fetchSecrets$: Observable<string | undefined> = defer(() =>
    // We have to use native fetch. Using Angular's HttpClient would cause
    // an infinite loop inside the interceptor.
    fetch('local.secrets.json'),
  ).pipe(
    switchMap(response => this.extractAzureToken(response)),
    tap(token => (this.cachedToken = token)),
  );

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const isLocalRequest = request.url.includes('localhost');
    if (isLocalRequest) {
      return next.handle(request);
    }

    if (this.cachedToken) {
      return next.handle(this.addFunctionsKeyHeader(request, this.cachedToken));
    }

    return this.fetchSecrets$.pipe(this.addFunctionsHeaderIfTokenFetched(next, request));
  }

  private addFunctionsHeaderIfTokenFetched(next: HttpHandler, request: HttpRequest<any>) {
    return switchMap((token: string | undefined) =>
      token ? next.handle(this.addFunctionsKeyHeader(request, token)) : next.handle(request),
    );
  }

  private addFunctionsKeyHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('x-functions-key', token),
    });
  }

  private extractAzureToken = (response: Response): Observable<string | undefined> =>
    response.ok ? from(response.json()).pipe(pluck<any, string>('azureFunctionsToken')) : of(undefined);
}
