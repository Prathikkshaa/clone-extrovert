// Root app shell.
// WHY: a thin shell that only hosts the router outlet. All screens are lazy
// routes (performance rule §7), so the shell stays minimal and route bundles
// load on demand.
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModeService } from './core/theme-mode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  // Instantiated at bootstrap so the saved/OS theme is applied before any screen
  // paints (its constructor sets <html data-theme>). Brand-accent theming
  // (ThemeService) is applied separately per-screen and composes with this.
  private readonly themeMode = inject(ThemeModeService);
}
