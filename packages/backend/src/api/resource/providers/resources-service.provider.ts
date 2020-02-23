import { Document } from 'mongoose';

import { RESOURCES_SERVICES } from '../constants';
import { Repository } from '../models';
import { ResourcesService } from '../services';
import { getResourceProviderTokens } from '../utils';

/**
 * Provider of resource services meta-service.
 */
export const resourcesServiceProvider = {
  provide: RESOURCES_SERVICES,
  useFactory: <D extends Document, T extends Repository<D>>(...providers: T[]): ResourcesService<D, T> =>
    new ResourcesService<D, T>(providers),
  inject: getResourceProviderTokens(),
};
