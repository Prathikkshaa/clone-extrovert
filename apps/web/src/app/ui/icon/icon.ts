// ui-icon — the single icon primitive (File 16 §3, inline-SVG fallback).
// WHY: one consistent icon system everywhere, at fixed sizes (16/18/20px) and
// proper a11y. Renders Lucide path data (see icon-paths.ts) into an inline SVG
// that inherits `currentColor`, so icons take the surrounding text colour and
// theme tokens with no extra wiring. Decorative by default (aria-hidden); pass a
// `label` to make it a labelled image for icon-only controls.
import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { ICON_PATHS, type IconName } from './icon-paths';

@Component({
  selector: 'ui-icon',
  // Encapsulation None so the svg sizing rule applies to the innerHTML-rendered
  // SVG (which Angular would otherwise not tag with this component's scope).
  encapsulation: ViewEncapsulation.None,
  template: `<span
    class="ui-icon"
    [style.width.px]="size()"
    [style.height.px]="size()"
    [attr.aria-hidden]="label() ? null : 'true'"
    [attr.role]="label() ? 'img' : null"
    [attr.aria-label]="label()"
    [innerHTML]="svg()"
  ></span>`,
  styles: `
    .ui-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      flex-shrink: 0;
    }
    .ui-icon svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);

  /** Icon name from the registry (icon-paths.ts). */
  readonly name = input.required<IconName>();
  /** Pixel size (square). Defaults to 18 — the nav/body default. */
  readonly size = input<number>(18);
  /** Stroke width; 2 matches Lucide's default. */
  readonly strokeWidth = input<number>(2);
  /** Accessible label for icon-only controls. Omit for decorative icons. */
  readonly label = input<string | null>(null);

  protected readonly svg = computed<SafeHtml>(() => {
    const inner = ICON_PATHS[this.name()] ?? '';
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="${this.strokeWidth()}" ` +
      `stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
