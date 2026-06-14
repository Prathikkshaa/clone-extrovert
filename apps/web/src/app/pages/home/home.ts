// Home — the launchpad (File 16 §3, Phase 3).
// WHY: the old home was a flat grid of ~10 equal buttons in no order. This
// orients a beginner: a "getting started" checklist that reflects real account
// state and ticks off as steps complete, a single primary "next step" CTA, a
// compact stats row for returning users, and the pipeline overview. All data is
// read from existing services; nothing here changes behaviour.
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { AuthService } from '../../core/auth.service';
import { CompanyProfileApiService } from '../../core/company-profile.service';
import { MeApiService } from '../../core/me.service';
import { MailboxApiService } from '../../core/mailbox-api.service';
import { LeadsApiService } from '../../core/leads.service';
import {
  DashboardApiService,
  type DashboardSummary,
} from '../../core/dashboard.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { PipelineStepper } from '../../ui/pipeline-stepper/pipeline-stepper';
import { Skeleton } from '../../ui/skeleton/skeleton';
import type { IconName } from '../../ui/icon/icon-paths';

interface ChecklistItem {
  key: string;
  label: string;
  hint: string;
  link: string;
  icon: IconName;
  done: boolean;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Button, Card, Icon, PageHeader, PipelineStepper, Skeleton],
  templateUrl: './home.html',
})
export class Home {
  private readonly auth = inject(AuthService);
  private readonly profiles = inject(CompanyProfileApiService);
  private readonly me = inject(MeApiService);
  private readonly mailboxes = inject(MailboxApiService);
  private readonly leads = inject(LeadsApiService);
  private readonly dashboard = inject(DashboardApiService);

  protected readonly appName = APP_NAME;
  protected readonly email = this.auth.currentEmail();

  // Each source resolves to a boolean (or count); null = still loading.
  private readonly mailboxConnected = signal<boolean | null>(null);
  private readonly profileSet = signal<boolean | null>(null);
  private readonly addressSet = signal<boolean | null>(null);
  private readonly hasCredits = signal<boolean | null>(null);
  private readonly hasLeads = signal<boolean | null>(null);
  protected readonly summary = signal<DashboardSummary | null>(null);

  protected readonly loading = computed(
    () =>
      this.mailboxConnected() === null ||
      this.profileSet() === null ||
      this.addressSet() === null ||
      this.hasCredits() === null ||
      this.hasLeads() === null,
  );

  protected readonly checklist = computed<ChecklistItem[]>(() => [
    {
      key: 'mailbox',
      label: 'Connect a mailbox',
      hint: 'Send from your own Gmail or Outlook.',
      link: '/mailboxes',
      icon: 'mail',
      done: this.mailboxConnected() === true,
    },
    {
      key: 'profile',
      label: 'Set up your company profile',
      hint: 'So emails are written in your voice.',
      link: '/onboarding',
      icon: 'building-2',
      done: this.profileSet() === true,
    },
    {
      key: 'address',
      label: 'Add your mailing address',
      hint: 'Required on every email to send legally.',
      link: '/settings',
      icon: 'map-pin',
      done: this.addressSet() === true,
    },
    {
      key: 'credits',
      label: 'Add credits',
      hint: 'Credits pay for finding, enriching and sending.',
      link: '/billing',
      icon: 'wallet',
      done: this.hasCredits() === true,
    },
    {
      key: 'leads',
      label: 'Find your first leads',
      hint: 'Search Google for businesses to reach out to.',
      link: '/search',
      icon: 'search',
      done: this.hasLeads() === true,
    },
  ]);

  protected readonly doneCount = computed(
    () => this.checklist().filter((i) => i.done).length,
  );
  protected readonly allDone = computed(
    () => !this.loading() && this.doneCount() === this.checklist().length,
  );
  /** First unfinished step — drives the primary CTA for new users. */
  protected readonly nextStep = computed(
    () => this.checklist().find((i) => !i.done) ?? null,
  );

  constructor() {
    this.mailboxes.list().subscribe({
      next: (list) => this.mailboxConnected.set(list.length > 0),
      error: () => this.mailboxConnected.set(false),
    });
    this.profiles.get().subscribe({
      next: (p) => this.profileSet.set(!!p?.services),
      error: () => this.profileSet.set(false),
    });
    this.me.get().subscribe({
      next: (m) => this.addressSet.set(!!m.physical_address),
      error: () => this.addressSet.set(false),
    });
    this.leads.getLists().subscribe({
      next: (lists) => this.hasLeads.set(lists.length > 0),
      error: () => this.hasLeads.set(false),
    });
    this.dashboard.summary().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.hasCredits.set(s.creditBalance > 0);
      },
      error: () => this.hasCredits.set(false),
    });
  }
}
