import { Routes } from '@angular/router';

/**
 * App routes.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: './site/site.module#SiteModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
