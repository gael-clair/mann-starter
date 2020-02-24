import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from './database';

/**
 * Core module activating:
 * - Database module.
 */
@Global()
@Module({
  imports: [DatabaseModule.forRoot()],
})
export class CoreModule {}
