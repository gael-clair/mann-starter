import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigurationService, LoggerService } from '../services';

/**
 * Interceptor to add if necessary REST API prefix to request.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  /**
   * Returns an instance of ApiPrefixInterceptor.
   * @param configurationService configuration service
   * @param logger logger service
   */
  constructor(private readonly configurationService: ConfigurationService, private readonly logger: LoggerService) {}

  /**
   * Adds prefix to all request not starting with http/https.
   * @param request request
   * @param next next request handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url)) {
      this.logger.debug(
        `Adding '${this.configurationService.serverURL}${this.configurationService.apiBase}' for '${request.url}' request`,
      );
      request = request.clone({
        url: `${this.configurationService.serverURL}${this.configurationService.apiBase}${request.url}`,
      });
    }
    return next.handle(request);
  }
}
