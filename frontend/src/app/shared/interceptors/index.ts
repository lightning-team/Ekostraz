import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AzureTokenInterceptor } from '@shared/interceptors/azure-token.interceptor';
import { ApiCredentialsInterceptor } from '@shared/interceptors/api-credentials.interceptor';
import { UnauthorizedInterceptor } from '@shared/interceptors/unauthorized.interceptor';

export const httpInterceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AzureTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiCredentialsInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptor,
    multi: true,
  },
];
