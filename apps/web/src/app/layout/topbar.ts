// app-topbar — the persistent top bar (File 16 §2, Phase 2).
// WHY: one place for "where am I / how do I get out": a back arrow + breadcrumb
// on the left (fed by BreadcrumbService from each screen's ui-page-header), and
// on the right the credits chip (red at 0, links to Billing), a dark/light
// toggle, a notifications bell (placeholder), and an account menu (settings,
// mailboxes, log out). A hamburger toggles the mobile drawer.
import { Location } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Icon } from '../ui/icon/icon';
import { AuthService } from '../core/auth.service';
import { BreadcrumbService } from '../core/breadcrumb.service';
import { ThemeModeService } from '../core/theme-mode.service';
import { CreditsApiService } from '../core/credits.service';
import { ThemeService } from '../core/theme.service';
import { NotificationsService } from '../core/notifications.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, Icon],
  template: `
    <div class="flex items-center gap-2 min-w-0">
      <button
        type="button"
        class="-ml-1 rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        (click)="toggleMenu.emit()"
        aria-label="Open menu"
      >
        <ui-icon name="menu" [size]="20" />
      </button>
      <button
        type="button"
        class="rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        (click)="back()"
        aria-label="Go back"
      >
        <ui-icon name="arrow-left" [size]="18" />
      </button>
      <nav aria-label="Breadcrumb" class="min-w-0">
        <ol class="flex items-center gap-1.5 text-sm">
          @for (crumb of crumbs(); track $index; let last = $last) {
            <!-- On mobile only the current (last) crumb shows; the back arrow
                 covers "up". Intermediate crumbs reveal from sm up. -->
            <li class="items-center gap-1.5 min-w-0" [class.hidden]="!last" [class.sm:flex]="!last" [class.flex]="last">
              @if (!last && crumb.link) {
                <a
                  [routerLink]="crumb.link"
                  class="truncate text-muted transition-colors duration-200 hover:text-ink"
                  >{{ crumb.label }}</a
                >
              } @else {
                <span class="truncate text-ink" [attr.aria-current]="last ? 'page' : null">{{
                  crumb.label
                }}</span>
              }
              @if (!last) {
                <ui-icon name="chevron-right" [size]="14" class="hidden shrink-0 text-muted sm:block" />
              }
            </li>
          }
        </ol>
      </nav>
    </div>

    <div class="flex items-center gap-1 sm:gap-2">
      @if (balance() !== null) {
        <a
          routerLink="/billing"
          class="rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium transition-colors duration-200 hover:bg-canvas"
          [class.text-ink]="balance()! > 0"
          [class.text-danger]="balance()! <= 0"
          [class.border-danger]="balance()! <= 0"
          title="Credit balance — buy more"
          ><span class="whitespace-nowrap">{{ balance() }} credits</span></a
        >
      }

      <button
        type="button"
        class="rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        (click)="toggleTheme($event)"
        [attr.aria-label]="
          themeMode.resolved() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        "
      >
        <ui-icon [name]="themeMode.resolved() === 'dark' ? 'sun' : 'moon'" [size]="18" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button
          type="button"
          class="relative rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          (click)="toggleNotif($event)"
          [attr.aria-expanded]="notifOpen()"
          aria-haspopup="menu"
          aria-label="Notifications"
        >
          <ui-icon name="bell" [size]="18" />
          @if (notifications.unreadCount() > 0) {
            <span
              class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white"
              >{{ notifications.unreadCount() }}</span
            >
          }
        </button>
        @if (notifOpen()) {
          <div
            class="absolute right-0 z-30 mt-2 w-80 max-w-[90vw] rounded-lg border border-line bg-surface shadow-lg"
            role="menu"
          >
            <div class="flex items-center justify-between border-b border-line px-3 py-2.5">
              <p class="text-sm font-medium text-ink">Notifications</p>
              @if (notifications.items().length > 0) {
                <button
                  type="button"
                  class="text-xs font-medium text-muted transition-colors duration-200 hover:text-ink"
                  (click)="clearAllNotif()"
                >
                  Clear all
                </button>
              }
            </div>
            @if (notifications.items().length === 0) {
              <div class="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <ui-icon name="bell-off" [size]="22" class="text-muted" />
                <p class="text-sm text-muted">You’re all caught up.</p>
              </div>
            } @else {
              <ul class="max-h-96 overflow-y-auto py-1">
                @for (n of notifications.items(); track n.id) {
                  <li class="group flex items-start gap-3 px-3 py-2.5 hover:bg-canvas">
                    <span
                      class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      [class.bg-danger-soft]="n.kind === 'critical'"
                      [class.text-danger]="n.kind === 'critical'"
                      [class.bg-warning-soft]="n.kind === 'warning'"
                      [class.text-warning]="n.kind === 'warning'"
                    >
                      <ui-icon [name]="n.icon" [size]="15" />
                    </span>
                    <a
                      [routerLink]="n.link"
                      class="min-w-0 flex-1"
                      (click)="closeNotif()"
                    >
                      <p class="text-sm font-medium text-ink">{{ n.title }}</p>
                      <p class="text-xs text-muted">{{ n.body }}</p>
                      <p class="mt-0.5 text-[11px] text-muted">{{ timeAgo(n.createdAt) }}</p>
                    </a>
                    <button
                      type="button"
                      class="shrink-0 rounded p-1 text-muted opacity-0 transition-opacity duration-200 hover:text-ink focus:opacity-100 group-hover:opacity-100"
                      (click)="dismissNotif(n.id, $event)"
                      aria-label="Dismiss notification"
                    >
                      <ui-icon name="x" [size]="14" />
                    </button>
                  </li>
                }
              </ul>
            }
          </div>
        }
      </div>

      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-1 rounded-md p-1.5 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          (click)="toggleAccount($event)"
          [attr.aria-expanded]="accountOpen()"
          aria-haspopup="menu"
          aria-label="Account menu"
        >
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent">
            <ui-icon name="user" [size]="16" />
          </span>
          <ui-icon name="chevron-down" [size]="14" />
        </button>
        @if (accountOpen()) {
          <div
            class="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-line bg-surface p-1.5 shadow-lg"
            role="menu"
          >
            @if (email()) {
              <p class="truncate px-3 py-2 text-xs text-muted">{{ email() }}</p>
            }
            <a
              routerLink="/settings"
              role="menuitem"
              class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink transition-colors duration-200 hover:bg-canvas"
              (click)="closeAccount()"
            >
              <ui-icon name="settings" [size]="16" /> Settings
            </a>
            <a
              routerLink="/mailboxes"
              role="menuitem"
              class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink transition-colors duration-200 hover:bg-canvas"
              (click)="closeAccount()"
            >
              <ui-icon name="mail" [size]="16" /> Mailboxes
            </a>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-ink transition-colors duration-200 hover:bg-canvas"
              (click)="logout()"
            >
              <ui-icon name="log-out" [size]="16" /> Log out
            </button>
          </div>
        }
      </div>
    </div>
  `,
  host: {
    class:
      'sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-canvas px-3 sm:px-4',
    '(document:click)': 'onDocumentClick()',
  },
})
export class Topbar {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly breadcrumbs = inject(BreadcrumbService);
  private readonly credits = inject(CreditsApiService);
  private readonly brandTheme = inject(ThemeService);
  protected readonly themeMode = inject(ThemeModeService);
  protected readonly notifications = inject(NotificationsService);

  protected readonly crumbs = this.breadcrumbs.crumbs;
  protected readonly email = signal<string | null>(this.auth.currentEmail());
  protected readonly balance = signal<number | null>(null);
  protected readonly accountOpen = signal(false);
  protected readonly notifOpen = signal(false);

  /** Asks the shell to open the mobile nav drawer. */
  readonly toggleMenu = output<void>();

  constructor() {
    this.loadBalance();
    this.notifications.refresh();
    // Refresh the credit chip, email and notifications after each navigation
    // (cheap, and keeps them honest after a paid action without a full reload).
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.email.set(this.auth.currentEmail());
        this.loadBalance();
        this.notifications.refresh();
      });
  }

  /**
   * Toggle dark/light with a circular "reveal" wipe from the clicked button using
   * the View Transitions API (the wow moment). Falls back to an instant toggle
   * when the API is unavailable or the user prefers reduced motion.
   */
  protected toggleTheme(event: MouseEvent): void {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduceMotion) {
      this.themeMode.toggle();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = doc.startViewTransition(() => this.themeMode.toggle());
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }

  private loadBalance(): void {
    this.credits.balance().subscribe({
      next: (b) => this.balance.set(b.balance),
      error: () => {
        /* chip is non-critical */
      },
    });
  }

  protected back(): void {
    this.location.back();
  }

  protected toggleAccount(event: Event): void {
    event.stopPropagation();
    this.accountOpen.update((v) => !v);
    this.notifOpen.set(false);
  }
  protected closeAccount(): void {
    this.accountOpen.set(false);
  }

  protected toggleNotif(event: Event): void {
    event.stopPropagation();
    this.notifOpen.update((v) => !v);
    this.accountOpen.set(false);
  }
  protected closeNotif(): void {
    this.notifOpen.set(false);
  }
  protected dismissNotif(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.notifications.dismiss(id);
  }
  protected clearAllNotif(): void {
    this.notifications.clearAll();
  }

  /** Short relative time for a notification, e.g. "just now", "3h ago", "Jun 14". */
  protected timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  protected onDocumentClick(): void {
    if (this.accountOpen()) this.accountOpen.set(false);
    if (this.notifOpen()) this.notifOpen.set(false);
  }

  protected async logout(): Promise<void> {
    this.closeAccount();
    await this.auth.signOut();
    this.brandTheme.reset();
    await this.router.navigateByUrl('/login');
  }
}
