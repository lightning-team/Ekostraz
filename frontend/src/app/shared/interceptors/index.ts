import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '@environment';
import { LocalAzureTokenInterceptor } from '@shared/interceptors/local-azure-token.interceptor';

const useLocalAzureTokenProvider = !environment.production;

const localAzureTokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LocalAzureTokenInterceptor,
  multi: true,
};

export const httpInterceptors = [...(useLocalAzureTokenProvider ? [localAzureTokenInterceptorProvider] : [])];
