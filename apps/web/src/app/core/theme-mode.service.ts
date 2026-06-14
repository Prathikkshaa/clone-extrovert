// ThemeModeService — light/dark mode (File 16 §3, Phase 0).
// WHY: dark mode is a token swap applied by toggling `data-theme` on <html>
// (styles.css defines the dark token block). This service owns that toggle:
// it reads the saved preference, falls back to the OS setting, applies it, and
// reacts to OS changes while in 'system'. It is ORTHOGONAL to ThemeService
// (which only overrides the brand-accent token) — they touch different tokens
// and compose cleanly.
import { Injectable, signal } from '@angular/core';

/** What the user picked. 'system' follows the OS preference live. */
export type ThemeMode = 'light' | 'dark' | 'system';
/** What is actually on screen after resolving 'system'. */
export type ResolvedMode = 'light' | 'dark';

const STORAGE_KEY = 'extrovertai.theme-mode';

@Injectable({ providedIn: 'root' })
export class ThemeModeService {
  /** The user's stored choice (light | dark | system). */
  readonly mode = signal<ThemeMode>('system');
  /** The mode currently applied to the document (light | dark). */
  readonly resolved = signal<ResolvedMode>('light');

  private readonly media =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  constructor() {
    this.mode.set(this.readStored());
    this.apply();
    // Keep 'system' in sync when the OS theme changes under us.
    this.media?.addEventListener('change', () => {
      if (this.mode() === 'system') this.apply();
    });
  }

  /** Set + persist an explicit mode (or 'system' to follow the OS). */
  set(mode: ThemeMode): void {
    this.mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
    this.apply();
  }

  /** Flip between light and dark based on what's currently on screen. */
  toggle(): void {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  /** Resolve the current mode and write it to <html data-theme>. */
  private apply(): void {
    const mode = this.mode();
    const resolved: ResolvedMode =
      mode === 'system' ? (this.media?.matches ? 'dark' : 'light') : mode;
    this.resolved.set(resolved);
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolved === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  private readStored(): ThemeMode {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') return v;
    } catch {
      /* ignore */
    }
    return 'system';
  }
}
