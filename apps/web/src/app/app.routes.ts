// Application routes.
// WHY: routes are lazy-loaded via loadComponent so each screen ships as its own
// bundle (performance rule §7). Even with a single route today, the structure is
// in place for later feature routes.
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.Landing),
  },
];
