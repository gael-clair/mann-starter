import { Routes } from '@angular/router';

/**
 * App routes.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@app/site/site.module').then(m => m.SiteModule),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
