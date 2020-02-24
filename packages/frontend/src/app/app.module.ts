import { NgModule } from '@angular/core';

import { ApiModule } from './api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';

/**
 * Application module activating:
 * - App routing module
 * - Core module
 * - API module
 */
@NgModule({
  imports: [CoreModule, AppRoutingModule, ApiModule.forRoot()],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
