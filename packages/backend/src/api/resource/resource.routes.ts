import { Route } from 'nest-router';

import * as resources from '@app/resources';

import { DEFAULT_RESOURCES_PATH } from './constants';
import { ResourceModule } from './resource.module';

/**
 * Internal routes of Resource module.
 */
export const routes: Route[] =
  Object.values(resources).length > 0
    ? [
        {
          path: `/${DEFAULT_RESOURCES_PATH}`,
          module: ResourceModule,
        },
      ]
    : [];
