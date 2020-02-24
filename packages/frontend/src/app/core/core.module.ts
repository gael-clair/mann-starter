import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { httpInterceptorProviders } from './interceptors';
import { errorHandlerProvider } from './providers';
import { ApiService, ConfigurationService, LoggerService } from './services';

/**
 * Core module activating:
 * - Browser module
 * - Browser animation mdule
 * - Http client module
 */
@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule],
  providers: [ConfigurationService, httpInterceptorProviders, errorHandlerProvider, ApiService, LoggerService],
  exports: [BrowserModule, BrowserAnimationsModule, HttpClientModule],
})
export class CoreModule {
  /**
   * Returns an instance of CoreModule if another instance not already exists.
   * @param parentModule parent module
   */
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Core module should be imported once in AppModule');
    }
  }
}
