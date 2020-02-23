import { Module } from '@nestjs/common';

import { LogController } from './controllers';
import { LogService } from './services';

/**
 * Module d'expositon du logging applicatif.
 */
@Module({
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
