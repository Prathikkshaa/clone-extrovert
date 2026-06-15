// BrandService — the current user's fetched brand (logo + name) for display.
// WHY: onboarding fetches the user's logo into company_profiles.logo_url and we
// apply their accent colour (ThemeService), but the LOGO itself was never shown
// anywhere (master-context §7 intends "logo + accent on our neutral base"). This
// holds the profile so the shell can fetch it once and the sidebar (and any other
// surface) can render the brand. The shell populates it; onboarding/settings
// refresh it on save so the logo updates without a reload.
import { Injectable, computed, signal } from '@angular/core';
import type { CompanyProfile } from './company-profile.service';

@Injectable({ providedIn: 'root' })
export class BrandService {
  readonly profile = signal<CompanyProfile | null>(null);

  /** The fetched logo URL, or null. */
  readonly logoUrl = computed(() => this.profile()?.logo_url ?? null);

  /** A display name derived from the website host (e.g. advensify.com → Advensify). */
  readonly name = computed(() => {
    const website = this.profile()?.website;
    if (!website) return null;
    try {
      const host = new URL(website).hostname.replace(/^www\./, '');
      const label = host.split('.')[0] ?? host;
      return label.charAt(0).toUpperCase() + label.slice(1);
    } catch {
      return null;
    }
  });

  /** True when there's something brand-y to show (a logo or a name). */
  readonly hasBrand = computed(() => !!this.logoUrl() || !!this.name());

  set(profile: CompanyProfile | null): void {
    this.profile.set(profile);
  }
}
