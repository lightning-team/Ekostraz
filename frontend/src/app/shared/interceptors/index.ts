import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AzureTokenInterceptor } from '@shared/interceptors/azure-token.interceptor';

export const httpInterceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AzureTokenInterceptor,
    multi: true,
  },
];
