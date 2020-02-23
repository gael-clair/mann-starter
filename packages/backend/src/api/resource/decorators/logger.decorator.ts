import { Logger } from '@app/logger/decorators';

import { RESOURCE_MODULE_LOGGER_ID } from '../constants';

/**
 * Returns injector of a logger for resource module.
 */
export function ResourceLogger(): (target: object, key: string | symbol, index?: number) => void {
  return Logger(RESOURCE_MODULE_LOGGER_ID);
}
