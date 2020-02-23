import { Route } from 'nest-router';

import { LogModule } from './log.module';

/**
 * Routes internes du module Log.
 */
export const routes: Route[] = [
  {
    path: `/logs`,
    module: LogModule,
  },
];
