import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixInterceptor } from '@app/core/interceptors/api-prefix.interceptor';

/**
 * HTTP interceptors array.
 */
export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiPrefixInterceptor,
    multi: true,
  },
];
