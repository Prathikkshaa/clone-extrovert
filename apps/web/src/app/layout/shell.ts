// app-shell — the persistent chrome around every authenticated screen (File 16 §2).
// WHY: the root used to be a bare <router-outlet>. This wraps the outlet in a
// sidebar + topbar so navigation, "where am I", credits, dark-mode and the
// account menu are always present. Mounts the single toast host + confirm dialog.
// On narrow screens the sidebar becomes an off-canvas drawer toggled from the
// topbar; a backdrop and any nav click close it.
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ToastHost } from '../ui/toast/toast-host';
import { ConfirmDialog } from '../ui/confirm/confirm-dialog';
import { CompanyProfileApiService } from '../core/company-profile.service';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, ToastHost, ConfirmDialog],
  template: `
    <div class="flex min-h-screen bg-canvas">
      <app-sidebar [open]="drawerOpen()" (navigate)="closeDrawer()" />

      @if (drawerOpen()) {
        <div
          class="fixed inset-0 z-30 bg-ink/40 md:hidden"
          aria-hidden="true"
          (click)="closeDrawer()"
        ></div>
      }

      <div class="flex min-w-0 flex-1 flex-col">
        <app-topbar (toggleMenu)="toggleDrawer()" />
        <main class="flex-1">
          <router-outlet />
        </main>
      </div>
    </div>

    <ui-toast-host />
    <ui-confirm-dialog />
  `,
})
export class Shell {
  protected readonly drawerOpen = signal(false);

  private readonly profiles = inject(CompanyProfileApiService);
  private readonly theme = inject(ThemeService);

  constructor() {
    // Apply the user's brand accent once for the whole authenticated area
    // (previously each screen re-fetched + re-applied it). Coexists with dark
    // mode (ThemeModeService) — different tokens.
    this.profiles.get().subscribe({
      next: (company) => this.theme.apply(company),
      error: () => {
        /* brand theme is optional */
      },
    });
  }

  protected toggleDrawer(): void {
    this.drawerOpen.update((v) => !v);
  }
  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
