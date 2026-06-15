// ThemeService — applies the user's brand accent as a token swap (master-context §7).
// WHY: theming changes ONLY the accent token on top of our neutral base; it never
// repaints backgrounds/text. Applying = set the CSS custom property; resetting =
// remove the override so the default token (official accent) takes over. No
// component edits needed — purely token values.
import { Injectable } from '@angular/core';
import type { CompanyProfile } from './company-profile.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Apply brand accent. DISABLED for now (master decision): we keep the static
   *  default teal accent and never repaint the UI in the user's colour — brand
   *  colours frequently fail contrast. The brand logo is still shown elsewhere.
   *  Re-enable by restoring the brand-accent branch below. */
  apply(_profile: CompanyProfile | null): void {
    this.reset();
  }

  /** Revert to the official ExtrovertAI accent (remove the override). */
  reset(): void {
    const root = document.documentElement;
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--color-accent-strong');
  }

  private darken(hex: string, amount: number): string {
    const h = hex.replace(/^#/, '');
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    if (!/^[0-9a-f]{6}$/i.test(full)) return hex;
    const adjust = (slice: string): string => {
      const v = Math.round(parseInt(slice, 16) * (1 - amount));
      return Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');
    };
    return `#${adjust(full.slice(0, 2))}${adjust(full.slice(2, 4))}${adjust(full.slice(4, 6))}`;
  }
}
