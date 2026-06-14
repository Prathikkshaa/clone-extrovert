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
            <li class="flex items-center gap-1.5 min-w-0">
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
                <ui-icon name="chevron-right" [size]="14" class="shrink-0 text-muted" />
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
          >{{ balance() }} credits</a
        >
      }

      <button
        type="button"
        class="rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        (click)="themeMode.toggle()"
        [attr.aria-label]="
          themeMode.resolved() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        "
      >
        <ui-icon [name]="themeMode.resolved() === 'dark' ? 'sun' : 'moon'" [size]="18" />
      </button>

      <button
        type="button"
        class="rounded-md p-2 text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Notifications"
      >
        <ui-icon name="bell" [size]="18" />
      </button>

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

  protected readonly crumbs = this.breadcrumbs.crumbs;
  protected readonly email = signal<string | null>(this.auth.currentEmail());
  protected readonly balance = signal<number | null>(null);
  protected readonly accountOpen = signal(false);

  /** Asks the shell to open the mobile nav drawer. */
  readonly toggleMenu = output<void>();

  constructor() {
    this.loadBalance();
    // Refresh the credit chip and email after each navigation (cheap, and keeps
    // the chip honest after a paid action without a full reload).
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.email.set(this.auth.currentEmail());
        this.loadBalance();
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
  }
  protected closeAccount(): void {
    this.accountOpen.set(false);
  }
  protected onDocumentClick(): void {
    if (this.accountOpen()) this.accountOpen.set(false);
  }

  protected async logout(): Promise<void> {
    this.closeAccount();
    await this.auth.signOut();
    this.brandTheme.reset();
    await this.router.navigateByUrl('/login');
  }
}
