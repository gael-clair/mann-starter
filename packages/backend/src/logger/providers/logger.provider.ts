import { Provider } from '@nestjs/common';

import { LoggerService } from '../services';
import { createLogger, getLoggers } from '../utils';

/**
 * Returns an injection token of a logger by its name.
 * @param name logger name
 */
export function getLoggerProviderToken(name: string): string {
  return `LoggerServiceFor${name.toLowerCase()}`;
}

/**
 * Returns an array of all logger providers.
 */
export function createLoggerProviders(): Array<Provider<LoggerService>> {
  const loggers = getLoggers();
  if (loggers.length > 0) {
    return loggers.map(logger => ({
      provide: getLoggerProviderToken(logger),
      useFactory: (loggerService: LoggerService): LoggerService => {
        loggerService.logger = createLogger(logger);
        return loggerService;
      },
      inject: [LoggerService],
    }));
  } else {
    return [];
  }
}
