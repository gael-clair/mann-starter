import { Inject } from '@nestjs/common';

import { DEFAULT_LOGGER_ID } from '../constants';
import { getLoggerProviderToken } from '../providers';
import { addLogger } from '../utils';

/**
 * Returns injector of the default global application logger.
 */
export function AppLogger(): (target: object, key: string | symbol, index?: number) => void {
  return Inject(getLoggerProviderToken(DEFAULT_LOGGER_ID));
}

/**
 * Returns injector of a logger with the given name.
 * If needed, it creates the logger.
 * @param name logger name
 */
export function Logger(
  name: string = DEFAULT_LOGGER_ID,
): (target: object, key: string | symbol, index?: number) => void {
  addLogger(name);
  return Inject(getLoggerProviderToken(name));
}
