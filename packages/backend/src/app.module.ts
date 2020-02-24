import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { ApiModule, routes } from '@app/api';
import { CoreModule } from '@app/core';
import { LoggingModule } from '@app/logger';

/**
 * Application module activating:
 * - Routing
 * - Core module
 * - Logging module
 * - API module
 */
@Module({
  imports: [RouterModule.forRoutes([routes]), CoreModule, LoggingModule.forRoot(), ApiModule],
})
export class AppModule {}
