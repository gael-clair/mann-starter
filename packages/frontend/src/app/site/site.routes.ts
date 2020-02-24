import { Routes } from '@angular/router';

import { HomeContainerComponent } from './containers';

/**
 * Site routing module routes.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeContainerComponent,
  },
  { path: '**', redirectTo: 'proxies', pathMatch: 'full' },
];
