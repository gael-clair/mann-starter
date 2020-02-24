import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { LogModule } from './log';
import { ResourceModule } from './resource';

/**
 * REST API module activating:
 * - Resource module
 * - Log module
 */
@Module({
  imports: [ResourceModule.forRoot(), LogModule],
  controllers: [ApiController],
})
export class ApiModule {}
