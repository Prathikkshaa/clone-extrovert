// Onboarding — the "wow in 60 seconds" website-to-profile flow (§7).
// WHY: paste a URL → we read the site → show a prefilled, editable profile to
// confirm. Always confirmable, never silently trusted; a clear manual path for
// people without a website; failures degrade to manual with plain copy.
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  CompanyProfileApiService,
  type CompanyProfile,
  type CrawlResult,
} from '../../core/company-profile.service';
import { ThemeService } from '../../core/theme.service';

type Step = 'url' | 'loading' | 'review';

@Component({
  selector: 'app-onboarding',
  imports: [FormsModule],
  templateUrl: './onboarding.html',
})
export class Onboarding {
  private readonly api = inject(CompanyProfileApiService);
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly step = signal<Step>('url');
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly isManual = signal(false);

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
    this.error.set(null);
    this.notice.set(null);
    if (!this.url.trim()) {
      this.error.set('Enter your website address (or choose “I don’t have a website”).');
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
    this.error.set(null);
    this.notice.set(null);
    this.isManual.set(true);
    this.step.set('review');
  }

  save(): void {
    this.error.set(null);
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
          void this.router.navigateByUrl('/home');
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Could not save your profile. Please try again.');
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
