import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as resources from '@app/resources';

import { ResourceController } from './controllers';
import { getResourceProviders, resourcesServiceProvider } from './providers';
import { getModels } from './utils';

/**
 * Resource Module.
 */
@Module({})
export class ResourceModule {
  public static forRoot(): DynamicModule {
    if (Object.values(resources).length > 0) {
      const resourceProviders = getResourceProviders();
      const models = getModels();
      const providers = [resourcesServiceProvider, ...resourceProviders];
      const mongooseModule = MongooseModule.forFeature(models);
      return {
        module: ResourceModule,
        imports: [mongooseModule],
        controllers: [ResourceController],
        providers,
        exports: [...providers, mongooseModule],
      };
    }
    return {
      module: ResourceModule,
    };
  }
}
