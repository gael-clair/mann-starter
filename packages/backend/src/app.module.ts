import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { ApiModule, routes } from '@app/api';
import { CoreModule } from '@app/core';
import { LoggingModule } from '@app/logger';

/**
 * Application module.
 * It handles application routing, core, logging and API activation.
 */
@Module({
  imports: [RouterModule.forRoutes([routes]), CoreModule, LoggingModule.forRoot(), ApiModule],
})
export class AppModule {}
