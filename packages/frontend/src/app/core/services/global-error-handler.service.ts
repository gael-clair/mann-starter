import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { AppError } from '../models';

import { LoggerService } from './logger.service';

/**
 * Global error handler.
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  /**
   * Default error message.
   */
  private static readonly DEFAULT_ERROR_MESSAGE = 'Oops, an error occurred !!';

  /**
   * Returns an instance of GlobalErrorHandler.
   * @param injector dependencies injector
   */
  constructor(private readonly injector: Injector) {}

  /**
   * Returns an instance of LoggerService.
   */
  private get loggerService() {
    return this.injector.get(LoggerService);
  }

  /**
   * Handles an error (parse and log)
   * @param error error to handle
   */
  handleError(error: any) {
    let message = GlobalErrorHandler.DEFAULT_ERROR_MESSAGE;
    let log = [error];
    if (error instanceof AppError) {
      // If error has a root cause, stack is logged too
      log = error.cause ? [error.message, `\nRoot cause:`, error.cause.stack ? error.cause.stack : error.cause] : log;
      message = error.message;
    }
    // Logs
    this.loggerService.error(log);
  }
}
