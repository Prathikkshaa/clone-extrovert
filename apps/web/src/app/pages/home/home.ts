// Home — the placeholder authenticated area.
// WHY: proves the protected zone works end-to-end: it's reachable only when
// authed (authGuard), shows the signed-in email, and fetches GET /me through the
// API (with the Bearer token attached by the interceptor) to display the profile.
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME, type Tables } from '@extrovertai/shared';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly email = this.auth.currentEmail();
  protected readonly profile = signal<Tables<'users'> | null>(null);
  protected readonly loadError = signal<string | null>(null);

  constructor() {
    this.http.get<Tables<'users'>>(`${environment.apiUrl}/me`).subscribe({
      next: (profile) => this.profile.set(profile),
      error: () =>
        this.loadError.set("Couldn't load your profile from the API. Please try again."),
    });
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
