// Application routes.
// WHY: all screens are lazy-loaded via loadComponent (performance rule §7).
// Auth screens (landing/login/signup) live OUTSIDE the app shell; every other
// screen renders inside the shell (sidebar + topbar) via a single parent route
// that is auth-guarded once — children no longer each carry authGuard. Paths are
// preserved exactly so no links break.
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    // The authenticated app shell (sidebar + topbar). Guarded once here.
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'mailboxes',
        loadComponent: () =>
          import('./pages/mailboxes/mailboxes').then((m) => m.Mailboxes),
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./pages/onboarding/onboarding').then((m) => m.Onboarding),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search').then((m) => m.Search),
      },
      {
        path: 'enrich',
        loadComponent: () =>
          import('./pages/enrich/enrich').then((m) => m.Enrich),
      },
      {
        path: 'draft',
        loadComponent: () => import('./pages/draft/draft').then((m) => m.Draft),
      },
      {
        path: 'send',
        loadComponent: () => import('./pages/send/send').then((m) => m.Send),
      },
      {
        path: 'campaigns/:id',
        loadComponent: () =>
          import('./pages/campaign/campaign').then((m) => m.Campaign),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./pages/inbox/inbox').then((m) => m.Inbox),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'billing',
        loadComponent: () =>
          import('./pages/billing/billing').then((m) => m.Billing),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
