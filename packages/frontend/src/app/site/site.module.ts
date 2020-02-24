import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { HomeComponent } from './components';
import { HomeContainerComponent } from './containers';
import { SiteRoutingModule } from './site-routing.module';

/**
 * Site module activating:
 * - Site routing module
 */
@NgModule({
  imports: [SharedModule, SiteRoutingModule],
  declarations: [HomeContainerComponent, HomeComponent],
})
export class SiteModule {}
