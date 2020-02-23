import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from './database';

/**
 * Core Module. It activates Database module.
 */
@Global()
@Module({
  imports: [DatabaseModule.forRoot()],
})
export class CoreModule {}
