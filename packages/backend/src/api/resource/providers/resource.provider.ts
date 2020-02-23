import { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { getLoggerProviderToken } from '@app/logger/providers';
import { LoggerService } from '@app/logger/services';
import * as resources from '@app/resources';

import { RESOURCE_MODULE_LOGGER_ID } from '../constants';
import { RepositoryService } from '../services';
import { getProviderToken } from '../utils';

/**
 * Returns an array of providers for all resource services.
 */
export function getResourceProviders(): Array<Provider<RepositoryService<any>>> {
  const providers: Array<Provider<RepositoryService<any>>> = [];
  Object.values(resources).forEach(resource => {
    providers.push({
      provide: getProviderToken(resource),
      useFactory: (model: Model<any>, logger: LoggerService) => new RepositoryService<any>(logger, model, resource),
      inject: [getModelToken(resource.name), getLoggerProviderToken(RESOURCE_MODULE_LOGGER_ID)],
    });
  });
  return providers;
}
