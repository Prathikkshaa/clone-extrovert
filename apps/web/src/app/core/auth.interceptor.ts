// authInterceptor — attaches the Supabase access token to API requests.
// WHY: protected API endpoints expect `Authorization: Bearer <token>`. Only
// requests to our own API (environment.apiUrl) get the header, so the token is
// never sent to third parties.
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).accessToken();

  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
