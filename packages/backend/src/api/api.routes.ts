import { Route } from 'nest-router';

import { ApiModule } from './api.module';
import { routes as logRoutes } from './log';
import { routes as resourceRoutes } from './resource';
import { DEFAULT_API_PATH } from './resource/constants';

/**
 * Internal routes of REST API Module.
 */
export const routes: Route = {
  path: `/${DEFAULT_API_PATH}`,
  module: ApiModule,
  children: [...resourceRoutes, ...logRoutes],
};
