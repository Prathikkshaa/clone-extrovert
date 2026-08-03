// Onboarding — the "wow in 60 seconds" website-to-profile flow (§7; File 16 kit).
// WHY: paste a URL → we read the site → show a prefilled, editable profile to
// confirm. Always confirmable, never silently trusted; a clear manual path for
// people without a website; failures degrade to manual with plain copy. Renders
// in the shell; errors go through toasts, the contextual result notice stays
// inline. The "Save and continue" action removes the old dead-end (→ Home).
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CompanyProfileApiService,
  type CompanyProfile,
  type CrawlResult,
} from '../../core/company-profile.service';
import { firstValueFrom } from 'rxjs';
import { ThemeService } from '../../core/theme.service';
import { BrandService } from '../../core/brand.service';
import { AuthService } from '../../core/auth.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { Field } from '../../ui/field/field';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import type { IconName } from '../../ui/icon/icon-paths';
import { ToastService } from '../../ui/toast/toast.service';

type Step = 'url' | 'loading' | 'review';

interface LoadingStep {
  label: string;
  icon: IconName;
}

// Friendly progress steps shown while the (single) crawl call runs. We don't have
// real per-stage progress, so they advance on a gentle timer to feel alive.
const LOADING_STEPS: LoadingStep[] = [
  { label: 'Visiting your website', icon: 'search' },
  { label: 'Reading your pages', icon: 'file-text' },
  { label: 'Understanding your business', icon: 'sparkles' },
  { label: 'Fetching your logo & colours', icon: 'palette' },
  { label: 'Writing your profile', icon: 'pen-line' },
];
const STEP_INTERVAL_MS = 1100;
// AI "improve" buttons unlock once there's enough to work with.
const MIN_ASSIST_CHARS = 10;

// Quick-pick tone chips — friendlier than a blank box (users rarely know what to type).
const TONE_SUGGESTIONS = [
  'Friendly and professional',
  'Warm and approachable',
  'Confident and direct',
  'Expert and reassuring',
];

// Starter templates for proof points — click to insert, then fill in the specifics.
// We never auto-invent numbers; these are scaffolds the user completes themselves.
const PROOF_EXAMPLES = [
  '4.9★ from [N] reviews',
  'Trusted by [N]+ local businesses',
  '[N] years in business',
  'Helped clients [achieve a specific result]',
];

@Component({
  selector: 'app-onboarding',
  imports: [FormsModule, Button, Card, Field, Icon, PageHeader],
  templateUrl: './onboarding.html',
})
export class Onboarding implements OnDestroy {
  private readonly api = inject(CompanyProfileApiService);
  private readonly theme = inject(ThemeService);
  private readonly brand = inject(BrandService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly step = signal<Step>('url');
  protected readonly notice = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly isManual = signal(false);
  /** True when we opened straight into review with an already-saved profile
   *  ("Update profile from website" from Settings) — changes the copy + actions. */
  protected readonly editingExisting = signal(false);

  protected readonly loadingSteps = LOADING_STEPS;
  protected readonly activeStep = signal(0);
  private loadingTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly toneSuggestions = TONE_SUGGESTIONS;
  protected readonly proofExamples = PROOF_EXAMPLES;
  /** Which field's "improve with AI" is currently running (null = none). */
  protected readonly assisting = signal<'services' | 'about' | 'value_prop' | null>(null);
  /** True while "Improve all with AI" is polishing every field in turn. */
  protected readonly improvingAll = signal(false);

  constructor() {
    // If a profile already exists, open in review with it prefilled so the user
    // SEES their current details (fixes "Update profile from website" showing blank).
    this.api.get().subscribe({
      next: (p) => {
        if (p && this.hasContent(p)) {
          this.prefill(p);
          this.editingExisting.set(true);
          this.step.set('review');
        }
      },
      error: () => {
        /* no existing profile / not critical — start at the URL step */
      },
    });
  }

  protected readonly title = computed(() => {
    switch (this.step()) {
      case 'loading':
        return 'Reading your site…';
      case 'review':
        return this.editingExisting()
          ? 'Your profile'
          : this.isManual()
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
  /** Logo candidates from the crawl — shown as a single-select picker. */
  protected readonly logoCandidates = signal<string[]>([]);

  selectLogo(url: string): void {
    this.logoUrl = url;
  }

  setTone(tone: string): void {
    this.tone = tone;
  }

  /** Enable the "improve with AI" button only once there's enough to work with. */
  canAssist(text: string): boolean {
    return text.trim().length >= MIN_ASSIST_CHARS && this.assisting() === null && !this.improvingAll();
  }

  /** How many of the 5 profile fields are filled — drives the completeness meter. */
  completedCount(): number {
    return this.fieldStatuses().filter((f) => f.done).length;
  }
  totalFields = 5;
  completionPct(): number {
    return Math.round((this.completedCount() / this.totalFields) * 100);
  }
  allDone(): boolean {
    return this.completedCount() === this.totalFields;
  }
  isFilled(text: string): boolean {
    return text.trim().length > 0;
  }
  /** Per-field done state — powers the meter's status pills + panel checks. */
  fieldStatuses(): { label: string; done: boolean }[] {
    return [
      { label: 'Offer', done: this.isFilled(this.services) },
      { label: 'About', done: this.isFilled(this.about) },
      { label: 'Promise', done: this.isFilled(this.valueProp) },
      { label: 'Tone', done: this.isFilled(this.tone) },
      { label: 'Proof', done: this.isFilled(this.proofText) },
    ];
  }
  /** Encouraging status line for the completeness card. */
  completionMessage(): string {
    const n = this.completedCount();
    if (n === 0) return 'Let’s fill this in — or read your website to auto-fill.';
    if (n >= this.totalFields) return 'Looking great — your profile is complete.';
    if (n >= 3) return 'Almost there — just a couple left.';
    return 'Good start — keep going.';
  }

  /** Polish every text field (that has enough content) with AI, in sequence. */
  async improveAll(): Promise<void> {
    if (this.improvingAll() || this.assisting()) return;
    const fields: ('services' | 'about' | 'value_prop')[] = ['services', 'about', 'value_prop'];
    const todo = fields.filter((f) => this.fieldValue(f).trim().length >= MIN_ASSIST_CHARS);
    if (todo.length === 0) {
      this.toast.warn('Add a few words to a field first, then improve all.');
      return;
    }
    this.improvingAll.set(true);
    let done = 0;
    for (const f of todo) {
      try {
        const { text } = await firstValueFrom(this.api.assist(f, this.fieldValue(f)));
        this.setFieldValue(f, text);
        done++;
      } catch {
        /* skip a field that fails; keep going */
      }
    }
    this.improvingAll.set(false);
    if (done > 0) this.toast.success(`Polished ${done} field${done === 1 ? '' : 's'} with AI.`);
    else this.toast.error('Couldn’t improve those right now — please try again.');
  }

  /** Append a proof-point starter template on its own line. */
  addProofExample(example: string): void {
    const lines = this.proofText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.includes(example)) return;
    this.proofText = [...lines, example].join('\n');
  }

  // --- live sample outreach email (built locally, updates as you type) ---
  sampleSubject(): string {
    const vp = this.valueProp.trim();
    return vp ? this.clip(vp, 60) : 'A quick idea for your business';
  }
  /** The sender's full name for the sign-off + "from" line. */
  senderName(): string {
    return this.auth.displayName() ?? 'Your name';
  }
  sampleGreeting(): string {
    return 'Hi [First name],';
  }
  /** Body paragraphs, each rendered with its own spacing in the preview. */
  sampleBody(): string[] {
    const offer = this.services.trim();
    const promise = this.valueProp.trim();
    const proof = this.proofText.split('\n').map((l) => l.trim()).filter(Boolean)[0];
    const paras = [
      offer
        ? `I run a business that ${this.lower(this.clip(offer, 160))}`
        : 'I run a business that helps companies like yours — [what you offer].',
      promise
        ? `The reason I’m reaching out: ${this.lower(this.clip(promise, 140))}`
        : '[Your main promise — the benefit they get.]',
    ];
    if (proof) paras.push(`A quick proof point: ${proof}.`);
    paras.push('Worth a short chat next week?');
    return paras;
  }
  private fieldValue(f: 'services' | 'about' | 'value_prop'): string {
    return f === 'services' ? this.services : f === 'about' ? this.about : this.valueProp;
  }
  private setFieldValue(f: 'services' | 'about' | 'value_prop', v: string): void {
    if (f === 'services') this.services = v;
    else if (f === 'about') this.about = v;
    else this.valueProp = v;
  }
  private clip(s: string, n: number): string {
    return s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
  }
  private lower(s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  /** Expand a field's rough notes into clear copy with AI (e.g. "digital marketing
   *  services" → a concrete description). Fills the field with the result. */
  assist(field: 'services' | 'about' | 'value_prop'): void {
    const current = field === 'services' ? this.services : field === 'about' ? this.about : this.valueProp;
    if (!this.canAssist(current)) {
      this.toast.warn('Type a few words first, then let AI expand them.');
      return;
    }
    this.assisting.set(field);
    this.api.assist(field, current).subscribe({
      next: ({ text }) => {
        if (field === 'services') this.services = text;
        else if (field === 'about') this.about = text;
        else this.valueProp = text;
        this.assisting.set(null);
        this.toast.success('Polished with AI — edit anything you like.');
      },
      error: (err) => {
        this.assisting.set(null);
        this.toast.error(err?.error?.message ?? 'Couldn’t generate that — please try again.');
      },
    });
  }

  /** Empty every field on the review form (keeps you on the page). */
  clearAll(): void {
    this.services = '';
    this.about = '';
    this.valueProp = '';
    this.tone = '';
    this.proofText = '';
    this.logoUrl = null;
    this.logoCandidates.set([]);
    this.notice.set(null);
    this.toast.info('Cleared. Fill it in or read a website again.');
  }

  /** Start over from the URL step to read a different website. */
  tryAnotherWebsite(): void {
    this.clearAll();
    this.website = null;
    this.url = '';
    this.isManual.set(false);
    this.editingExisting.set(false);
    this.step.set('url');
  }

  readSite(): void {
    this.notice.set(null);
    if (!this.url.trim()) {
      this.toast.warn('Enter your website address (or choose “I don’t have a website”).');
      return;
    }
    this.step.set('loading');
    this.startLoadingAnimation();
    this.api.crawl(this.url).subscribe({
      next: (res) => {
        this.stopLoadingAnimation();
        this.fillFromCrawl(res);
      },
      error: (err) => {
        this.stopLoadingAnimation();
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

  ngOnDestroy(): void {
    this.stopLoadingAnimation();
  }

  private startLoadingAnimation(): void {
    this.activeStep.set(0);
    this.stopLoadingAnimation();
    this.loadingTimer = setInterval(() => {
      // Advance, but hold on the last step until the real response lands.
      this.activeStep.update((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, STEP_INTERVAL_MS);
  }

  private stopLoadingAnimation(): void {
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer);
      this.loadingTimer = null;
    }
  }

  startManual(): void {
    this.notice.set(null);
    this.isManual.set(true);
    this.step.set('review');
  }

  save(): void {
    this.saving.set(true);
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
        // Static default accent for now — we don't repaint the UI in the user's
        // colour, so never persist 'fetched'.
        theme_source: 'official',
      })
      .subscribe({
        next: (saved) => {
          this.theme.apply(saved);
          this.brand.set(saved);
          this.toast.success('Profile saved.');
          void this.router.navigateByUrl('/home');
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Could not save your profile. Please try again.');
        },
      });
  }

  /** Any user-facing content worth showing on the review step? */
  private hasContent(p: CompanyProfile): boolean {
    return !!(
      p.services ||
      p.about ||
      p.value_prop ||
      p.tone ||
      (p.proof_points && p.proof_points.length) ||
      p.website
    );
  }

  /** Copy a profile into the editable review fields. */
  private prefill(p: CompanyProfile): void {
    this.website = p.website;
    this.url = p.website ?? '';
    this.services = p.services ?? '';
    this.about = p.about ?? '';
    this.valueProp = p.value_prop ?? '';
    this.tone = p.tone ?? '';
    this.proofText = (p.proof_points ?? []).join('\n');
    this.brandColor = p.brand_color;
    this.useBranding = p.theme_source === 'fetched' && !!p.brand_color;
    if (p.logo_url) {
      this.logoUrl = p.logo_url;
      this.logoCandidates.set([p.logo_url]);
    }
  }

  private fillFromCrawl(res: CrawlResult): void {
    const p: CompanyProfile = res.profile;
    this.prefill(p);
    this.editingExisting.set(false);
    // Logo candidates: include the saved best guess + all crawl candidates.
    const candidates = [
      ...(res.meta.logoCandidates ?? []),
      ...(p.logo_url ? [p.logo_url] : []),
    ].filter((v, i, a) => a.indexOf(v) === i);
    this.logoCandidates.set(candidates);
    this.logoUrl = candidates[0] ?? p.logo_url;
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
