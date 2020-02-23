import { Logger } from '@app/logger/decorators';

import { LOG_MODULE_LOGGER_ID } from '../constants';

/**
 * Returns injector of a logger for Log module.
 */
export function LogLogger(): (target: object, key: string | symbol, index?: number) => void {
  return Logger(LOG_MODULE_LOGGER_ID);
}
