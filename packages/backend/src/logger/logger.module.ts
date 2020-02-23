import { Global, Module, DynamicModule } from '@nestjs/common';

import { DEFAULT_LOGGER_ID } from './constants';
import { createLoggerProviders } from './providers';
import { LoggerService } from './services';
import { addLogger } from './utils';

/**
 * Logging module.
 */
@Global()
@Module({})
export class LoggingModule {
  /**
   * Returns a logging module with all necessary loggers. New loggers can be created using annotation @Logger in constructor injection of any component of the application.
   */
  public static forRoot(): DynamicModule {
    // Adds default global application logger
    addLogger(DEFAULT_LOGGER_ID);

    // Creates all providers for all loggers added through the use of @Logger annotation
    const loggerProviders = createLoggerProviders();
    return {
      module: LoggingModule,
      providers: [LoggerService, ...loggerProviders],
      exports: [LoggerService, ...loggerProviders],
    };
  }
}
