// Onboarding — the "wow in 60 seconds" website-to-profile flow (§7; File 16 kit).
// WHY: paste a URL → we read the site → show a prefilled, editable profile to
// confirm. Always confirmable, never silently trusted; a clear manual path for
// people without a website; failures degrade to manual with plain copy. Renders
// in the shell; errors go through toasts, the contextual result notice stays
// inline. The "Save and continue" action removes the old dead-end (→ Home).
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CompanyProfileApiService,
  type CompanyProfile,
  type CrawlResult,
} from '../../core/company-profile.service';
import { ThemeService } from '../../core/theme.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { Field } from '../../ui/field/field';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { ToastService } from '../../ui/toast/toast.service';

type Step = 'url' | 'loading' | 'review';

@Component({
  selector: 'app-onboarding',
  imports: [FormsModule, Button, Card, Field, PageHeader, Skeleton],
  templateUrl: './onboarding.html',
})
export class Onboarding {
  private readonly api = inject(CompanyProfileApiService);
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly step = signal<Step>('url');
  protected readonly notice = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly isManual = signal(false);

  protected readonly title = computed(() => {
    switch (this.step()) {
      case 'loading':
        return 'Reading your site…';
      case 'review':
        return this.isManual()
          ? 'Tell us about your business'
          : 'Here’s what we found — does this look right?';
      default:
        return 'Set up your profile';
    }
  });

  // URL step
  protected url = '';

  // Review step (editable)
  protected website: string | null = null;
  protected services = '';
  protected about = '';
  protected valueProp = '';
  protected tone = '';
  protected proofText = '';
  protected logoUrl: string | null = null;
  protected brandColor: string | null = null;
  protected useBranding = false;

  readSite(): void {
    this.notice.set(null);
    if (!this.url.trim()) {
      this.toast.warn('Enter your website address (or choose “I don’t have a website”).');
      return;
    }
    this.step.set('loading');
    this.api.crawl(this.url).subscribe({
      next: (res) => this.fillFromCrawl(res),
      error: (err) => {
        // Crawl failed → fall back to the manual path with a plain message.
        this.isManual.set(true);
        this.website = this.url;
        this.notice.set(
          err?.error?.message ??
            'We couldn’t read that site. You can add your details by hand below.',
        );
        this.step.set('review');
      },
    });
  }

  startManual(): void {
    this.notice.set(null);
    this.isManual.set(true);
    this.step.set('review');
  }

  save(): void {
    this.saving.set(true);
    const useBrand = this.useBranding && !!this.brandColor;
    this.api
      .save({
        website: this.website,
        services: this.services || null,
        about: this.about || null,
        value_prop: this.valueProp || null,
        tone: this.tone || null,
        proof_points: this.proofText
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        logo_url: this.logoUrl,
        brand_color: this.brandColor,
        theme_source: useBrand ? 'fetched' : 'official',
      })
      .subscribe({
        next: (saved) => {
          this.theme.apply(saved);
          this.toast.success('Profile saved.');
          void this.router.navigateByUrl('/home');
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Could not save your profile. Please try again.');
        },
      });
  }

  private fillFromCrawl(res: CrawlResult): void {
    const p: CompanyProfile = res.profile;
    this.website = p.website;
    this.services = p.services ?? '';
    this.about = p.about ?? '';
    this.valueProp = p.value_prop ?? '';
    this.tone = p.tone ?? '';
    this.proofText = (p.proof_points ?? []).join('\n');
    this.logoUrl = p.logo_url;
    this.brandColor = p.brand_color;
    this.useBranding = p.theme_source === 'fetched' && !!p.brand_color;
    this.isManual.set(false);

    if (res.meta.extractionFailed) {
      this.notice.set(
        'We read your site but couldn’t auto-fill everything — please add the details below.',
      );
    } else if (res.meta.accentFallback) {
      this.notice.set(
        'Your brand color was a bit light for buttons, so we kept the default accent. You can change this in Settings.',
      );
    }
    this.step.set('review');
  }
}
