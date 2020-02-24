import { InjectionToken } from '@angular/core';
import { ResourceItem } from '@app/core/models';

import { ResourceService } from '../services';

/**
 * Resource services list provider.
 */
export const RESOURCE_SERVICES = new InjectionToken<ResourceService<ResourceItem>>('ResourceServices');
