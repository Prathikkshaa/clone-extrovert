// Application routes.
// WHY: all screens are lazy-loaded via loadComponent (performance rule §7).
// Auth routes are gated: /login and /signup are guest-only, /home requires auth.
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
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'mailboxes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mailboxes/mailboxes').then((m) => m.Mailboxes),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/onboarding/onboarding').then((m) => m.Onboarding),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/search/search').then((m) => m.Search),
  },
  {
    path: 'enrich',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/enrich/enrich').then((m) => m.Enrich),
  },
  {
    path: 'draft',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/draft/draft').then((m) => m.Draft),
  },
  {
    path: 'send',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/send/send').then((m) => m.Send),
  },
  {
    path: 'campaigns/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/campaign/campaign').then((m) => m.Campaign),
  },
  {
    path: 'inbox',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/inbox/inbox').then((m) => m.Inbox),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
