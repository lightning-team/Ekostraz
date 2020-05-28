import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

/**
 * Interceptor adding Azure Functions Token to request header.
 */
@Injectable()
export class AzureTokenInterceptor implements HttpInterceptor {
  private token = environment.functionsKey;

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(this.addFunctionsKeyHeader(request, this.token));
  }

  private addFunctionsKeyHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('x-functions-key', token),
    });
  }
}
