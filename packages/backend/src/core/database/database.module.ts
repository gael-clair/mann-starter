import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { DATABASE_URL } from '@app/core/config/constants';
import { getStringFromEnv } from '@app/core/config/utils';



/**
 * Database module in charge of database connection.
 */
@Module({})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const resources = require('@app/resources');
    return {
      module: DatabaseModule,
      imports: [
        ...(Object.values(resources).length > 0
          ? [
              MongooseModule.forRootAsync({
                useFactory: () => {
                  (mongoose as any).Promise = global.Promise;
                  mongoose.set('useCreateIndex', true);
                  mongoose.set('useFindAndModify', false);
                  mongoose.set('useUnifiedTopology', true);
                  return {
                    useNewUrlParser: true,
                    uri: getStringFromEnv(DATABASE_URL),
                  };
                },
              }),
            ]
          : []),
      ],
    };
  }
}
