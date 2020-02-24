import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import * as resources from '../resources';

import { validateResourcesAndGetProviders } from './utils';

/**
 * REST resource API module.
 */
@NgModule()
export class ApiModule {
  /**
   * Returns an instance of ApiModule if another instance not already exists.
   * @param parentModule parent module
   */
  constructor(@Optional() @SkipSelf() parentModule: ApiModule) {
    if (parentModule) {
      throw new Error('ApiModule should be imported once in AppModule using forRoot()');
    }
  }

  /**
   * Returns module with necessary resource providers.
   */
  static forRoot() {
    return {
      ngModule: ApiModule,
      providers:
        Object.values(resources).length > 0 ? [...validateResourcesAndGetProviders(Object.values(resources))] : [],
    };
  }
}
