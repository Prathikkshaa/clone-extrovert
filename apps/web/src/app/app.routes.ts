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
  { path: '**', redirectTo: '' },
];
