// Settings — theme control (master-context §7: one-click reset to official theme).
// WHY: lets the user switch between their fetched branding and the ExtrovertAI
// default at any time. Sends the FULL profile on save so toggling the theme never
// drops other fields.
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  CompanyProfileApiService,
  type CompanyProfile,
} from '../../core/company-profile.service';
import { MeApiService } from '../../core/me.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, FormsModule],
  templateUrl: './settings.html',
})
export class Settings {
  private readonly api = inject(CompanyProfileApiService);
  private readonly me = inject(MeApiService);
  private readonly theme = inject(ThemeService);

  protected readonly appName = APP_NAME;
  protected readonly profile = signal<CompanyProfile | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  // Mailing address (legally required to send — File 11 compliance).
  protected address = '';
  protected readonly savingAddress = signal(false);
  protected readonly addressMsg = signal<{ kind: 'info' | 'warn'; text: string } | null>(null);

  constructor() {
    this.api.get().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.theme.apply(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your settings.');
        this.loading.set(false);
      },
    });
    this.me.get().subscribe({
      next: (m) => (this.address = m.physical_address ?? ''),
      error: () => {
        /* address is loaded best-effort */
      },
    });
  }

  saveAddress(): void {
    this.addressMsg.set(null);
    if (!this.address.trim()) {
      this.addressMsg.set({ kind: 'warn', text: 'Enter your mailing address.' });
      return;
    }
    this.savingAddress.set(true);
    this.me.update({ physical_address: this.address.trim() }).subscribe({
      next: (m) => {
        this.address = m.physical_address ?? '';
        this.savingAddress.set(false);
        this.addressMsg.set({ kind: 'info', text: 'Saved. You can now send compliant emails.' });
      },
      error: () => {
        this.savingAddress.set(false);
        this.addressMsg.set({ kind: 'warn', text: 'Could not save. Please try again.' });
      },
    });
  }

  setTheme(source: 'fetched' | 'official'): void {
    const p = this.profile();
    if (!p) return;
    this.saving.set(true);
    this.error.set(null);
    this.api
      .save({
        website: p.website,
        services: p.services,
        about: p.about,
        value_prop: p.value_prop,
        tone: p.tone,
        proof_points: p.proof_points ?? [],
        logo_url: p.logo_url,
        brand_color: p.brand_color,
        theme_source: source,
      })
      .subscribe({
        next: (saved) => {
          this.profile.set(saved);
          if (source === 'fetched') this.theme.apply(saved);
          else this.theme.reset();
          this.saving.set(false);
        },
        error: () => {
          this.error.set('Could not update your theme. Please try again.');
          this.saving.set(false);
        },
      });
  }
}
