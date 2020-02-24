import { ErrorHandler } from '@angular/core';

import { GlobalErrorHandler } from '../services';

/**
 * Global error handler provider.
 */
export const errorHandlerProvider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
};
