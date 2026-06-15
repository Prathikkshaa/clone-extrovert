// Settings (File 16 shell + kit) — Appearance / Theme / Mailing address / Booking.
// WHY: one place for account preferences. Brand theme switches between the user's
// fetched branding and the default (sends the FULL profile on save so toggling
// never drops fields); an Appearance control sets light/dark/system (persisted by
// ThemeModeService); mailing address (compliance, File 11) and the Cal.com booking
// link (File 13). All saves confirm via toasts.
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CompanyProfileApiService,
  type CompanyProfile,
} from '../../core/company-profile.service';
import { AuthService } from '../../core/auth.service';
import { MeApiService } from '../../core/me.service';
import { MailboxApiService, type MailboxItem } from '../../core/mailbox-api.service';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../core/theme.service';
import { BrandService } from '../../core/brand.service';
import { ThemeModeService, type ThemeMode } from '../../core/theme-mode.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-settings',
  imports: [
    RouterLink,
    FormsModule,
    Button,
    Card,
    Icon,
    PageHeader,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './settings.html',
})
export class Settings {
  private readonly api = inject(CompanyProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly mailboxApi = inject(MailboxApiService);
  private readonly me = inject(MeApiService);
  private readonly theme = inject(ThemeService);
  private readonly brand = inject(BrandService);
  protected readonly themeMode = inject(ThemeModeService);
  private readonly toast = inject(ToastService);

  protected readonly appName = environment.appName;

  // Display name (auth metadata) — used in greetings + email sign-offs.
  protected fullName = this.auth.displayName() ?? '';
  protected readonly savingName = signal(false);

  // Connected mailboxes (read-only summary; full management on /mailboxes).
  protected readonly mailboxes = signal<MailboxItem[]>([]);

  protected readonly profile = signal<CompanyProfile | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);

  protected readonly appearanceOptions: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  // Mailing address (legally required to send — File 11 compliance).
  protected address = '';
  protected readonly savingAddress = signal(false);

  // Cal.com booking link (File 13) — the CTA dropped into outreach emails.
  protected bookingUrl = '';
  protected readonly bookingConnected = signal(false);
  protected readonly savingBooking = signal(false);

  constructor() {
    this.api.get().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.theme.apply(p);
        this.brand.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Could not load your settings.');
        this.loading.set(false);
      },
    });
    this.mailboxApi.list().subscribe({
      next: (m) => this.mailboxes.set(m.filter((x) => x.status !== 'disconnected')),
      error: () => {
        /* mailbox summary is best-effort */
      },
    });
    this.me.get().subscribe({
      next: (m) => {
        this.address = m.physical_address ?? '';
        this.bookingUrl = m.booking_url ?? '';
        this.bookingConnected.set(Boolean(m.booking_url));
      },
      error: () => {
        /* address + booking link are loaded best-effort */
      },
    });
  }

  setAppearance(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  protected providerLabel(provider: string): string {
    return provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook' : provider;
  }

  async saveName(): Promise<void> {
    const name = this.fullName.trim();
    if (!name) {
      this.toast.warn('Enter your name.');
      return;
    }
    this.savingName.set(true);
    const { error } = await this.auth.updateName(name);
    this.savingName.set(false);
    if (error) {
      this.toast.error('Could not save your name. Please try again.');
      return;
    }
    this.fullName = this.auth.displayName() ?? name;
    this.toast.success('Saved. We’ll use your name to personalise things.');
  }

  saveAddress(): void {
    if (!this.address.trim()) {
      this.toast.warn('Enter your mailing address.');
      return;
    }
    this.savingAddress.set(true);
    this.me.update({ physical_address: this.address.trim() }).subscribe({
      next: (m) => {
        this.address = m.physical_address ?? '';
        this.savingAddress.set(false);
        this.toast.success('Saved. You can now send compliant emails.');
      },
      error: () => {
        this.savingAddress.set(false);
        this.toast.error('Could not save. Please try again.');
      },
    });
  }

  saveBooking(): void {
    this.savingBooking.set(true);
    this.me.update({ booking_url: this.bookingUrl.trim() }).subscribe({
      next: (m) => {
        this.bookingUrl = m.booking_url ?? '';
        this.bookingConnected.set(Boolean(m.booking_url));
        this.savingBooking.set(false);
        this.toast.success(
          m.booking_url
            ? 'Connected. Your booking link will be added to outreach emails.'
            : 'Booking link removed.',
        );
      },
      error: () => {
        this.savingBooking.set(false);
        this.toast.error('Could not save. Check the link and try again.');
      },
    });
  }

  setTheme(source: 'fetched' | 'official'): void {
    const p = this.profile();
    if (!p) return;
    this.saving.set(true);
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
          this.brand.set(saved);
          if (source === 'fetched') this.theme.apply(saved);
          else this.theme.reset();
          this.saving.set(false);
          this.toast.success('Theme updated.');
        },
        error: () => {
          this.toast.error('Could not update your theme. Please try again.');
          this.saving.set(false);
        },
      });
  }
}
