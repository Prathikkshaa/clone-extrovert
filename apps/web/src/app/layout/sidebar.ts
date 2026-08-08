// app-sidebar — the persistent left navigation (File 16 §2, Phase 2).
// WHY: every screen used to improvise its own nav. This is the one grouped nav:
// Workflow (the Find→Enrich→Write→Send pipeline, in order), Manage (Inbox +
// Dashboard), and pinned Billing/Settings at the bottom. The active route is
// highlighted (teal-tinted). On narrow screens the shell turns this into an
// off-canvas drawer; `open` drives the slide and clicking a link emits navigate
// so the shell can close it.
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../ui/icon/icon';
import { Wordmark } from '../ui/wordmark/wordmark';
import type { IconName } from '../ui/icon/icon-paths';
import { NavBadgeService } from '../core/nav-badge.service';
import { BrandService } from '../core/brand.service';

interface NavItem {
  label: string;
  link: string;
  icon: IconName;
  badge?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon, Wordmark],
  template: `
    <a
      routerLink="/home"
      class="flex items-center px-4 py-4 text-ink"
      (click)="navigate.emit()"
    >
      <ui-wordmark class="text-heading-sm" />
    </a>

    <nav class="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-2">
      <!-- Home: an explicit, always-present link to the dashboard/home, sitting
           directly below the logo and above the workflow pipeline. -->
      <div>
        <a
          #rlaHome="routerLinkActive"
          routerLinkActive
          routerLink="/home"
          [class]="linkClass(rlaHome.isActive)"
          (click)="navigate.emit()"
        >
          <ui-icon name="home" [size]="18" class="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90" />
          <span class="flex-1 transition-transform duration-200 group-hover:translate-x-0.5"
            >Home</span
          >
        </a>
      </div>

      <div>
        <p class="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
          Workflow
        </p>
        @for (item of workflow; track item.link) {
          <a
            #rla="routerLinkActive"
            routerLinkActive
            [routerLink]="item.link"
            [class]="linkClass(rla.isActive)"
            (click)="navigate.emit()"
          >
            <ui-icon [name]="item.icon" [size]="18" class="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90" />
            <span class="flex-1 transition-transform duration-200 group-hover:translate-x-0.5">{{
              item.label
            }}</span>
          </a>
        }
      </div>

      <div>
        <p class="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
          Manage
        </p>
        @for (item of manage; track item.link) {
          <a
            #rla="routerLinkActive"
            routerLinkActive
            [routerLink]="item.link"
            [class]="linkClass(rla.isActive)"
            (click)="navigate.emit()"
          >
            <ui-icon [name]="item.icon" [size]="18" class="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90" />
            <span class="flex-1 transition-transform duration-200 group-hover:translate-x-0.5">{{
              item.label
            }}</span>
            @if (item.badge && inboxUnread() > 0) {
              <span
                class="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium text-white"
                >{{ inboxUnread() }}</span
              >
            }
          </a>
        }
      </div>
    </nav>

    <!-- Brand: the user's fetched logo ONLY. No logo → show nothing here (no
         monogram, no text) so the sidebar stays clean. -->
    @if (brand.logoUrl(); as logo) {
      <a
        routerLink="/settings"
        class="block px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        [title]="brand.name() ?? 'Your brand'"
        (click)="navigate.emit()"
      >
        <img [src]="logo" [alt]="brand.name() ?? ''" class="h-16 w-full object-contain" />
      </a>
    }

    <div class="border-t border-line px-3 py-3">
      @for (item of pinned; track item.link) {
        <a
          #rla="routerLinkActive"
          routerLinkActive
          [routerLink]="item.link"
          [class]="linkClass(rla.isActive)"
          (click)="navigate.emit()"
        >
          <ui-icon [name]="item.icon" [size]="18" class="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90" />
          <span class="flex-1 transition-transform duration-200 group-hover:translate-x-0.5">{{
            item.label
          }}</span>
        </a>
      }
    </div>
  `,
  host: { '[class]': 'hostClass()' },
})
export class Sidebar {
  /** Drawer open state (mobile). Desktop is always visible. */
  readonly open = input(false);
  /** Emitted when a nav link is clicked so the shell can close the drawer. */
  readonly navigate = output<void>();

  private readonly badges = inject(NavBadgeService);
  protected readonly inboxUnread = this.badges.inboxUnread;
  protected readonly brand = inject(BrandService);

  protected readonly workflow: NavItem[] = [
    { label: 'Find leads', link: '/search', icon: 'search' },
    { label: 'Enrich', link: '/enrich', icon: 'sparkles' },
    { label: 'Write', link: '/draft', icon: 'pen-line' },
    { label: 'Send', link: '/send', icon: 'send' },
  ];
  protected readonly manage: NavItem[] = [
    { label: 'Inbox', link: '/inbox', icon: 'inbox', badge: true },
    { label: 'Dashboard', link: '/dashboard', icon: 'layout-dashboard' },
  ];
  protected readonly pinned: NavItem[] = [
    { label: 'Billing', link: '/billing', icon: 'wallet' },
    { label: 'Settings', link: '/settings', icon: 'settings' },
  ];

  private static readonly LINK_BASE =
    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ' +
    'transition-colors duration-200 focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-accent';

  protected linkClass(active: boolean): string {
    return active
      ? `${Sidebar.LINK_BASE} bg-accent-soft text-accent`
      : `${Sidebar.LINK_BASE} text-muted hover:bg-canvas hover:text-ink`;
  }

  protected readonly hostClass = computed(
    () =>
      'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-line ' +
      'bg-surface transition-transform duration-200 md:sticky md:top-0 md:h-screen ' +
      (this.open() ? 'translate-x-0' : '-translate-x-full md:translate-x-0'),
  );
}
