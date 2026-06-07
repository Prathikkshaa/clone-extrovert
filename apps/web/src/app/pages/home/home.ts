// Home — the placeholder authenticated area.
// WHY: proves the protected zone works end-to-end (reachable only when authed,
// shows the signed-in email, fetches GET /me). Also loads the company profile to
// apply the user's brand theme and surface onboarding/settings.
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME, type Tables } from '@extrovertai/shared';
import { AuthService } from '../../core/auth.service';
import {
  CompanyProfileApiService,
  type CompanyProfile,
} from '../../core/company-profile.service';
import { ThemeService } from '../../core/theme.service';
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
  private readonly profiles = inject(CompanyProfileApiService);
  private readonly theme = inject(ThemeService);

  protected readonly appName = APP_NAME;
  protected readonly email = this.auth.currentEmail();
  protected readonly profile = signal<Tables<'users'> | null>(null);
  protected readonly company = signal<CompanyProfile | null>(null);
  protected readonly loadError = signal<string | null>(null);

  constructor() {
    this.http.get<Tables<'users'>>(`${environment.apiUrl}/me`).subscribe({
      next: (profile) => this.profile.set(profile),
      error: () =>
        this.loadError.set("Couldn't load your profile from the API. Please try again."),
    });
    this.profiles.get().subscribe({
      next: (company) => {
        this.company.set(company);
        this.theme.apply(company);
      },
      error: () => {
        /* profile is optional on home; ignore load errors here */
      },
    });
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.theme.reset();
    await this.router.navigateByUrl('/login');
  }
}
