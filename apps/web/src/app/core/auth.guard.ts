// Route guards.
// WHY: keep protected app routes behind authentication, and keep the login/signup
// pages away from already-authenticated users. Both await AuthService.ready so
// the initial session is known before deciding (no false redirect on reload).
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Allow only authenticated users; otherwise redirect to /login. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};

/** Allow only signed-out users (login/signup pages); otherwise go to /home. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.isAuthenticated() ? router.parseUrl('/home') : true;
};
