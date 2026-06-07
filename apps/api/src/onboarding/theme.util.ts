// Theme helpers — accent contrast guard (master-context §7).
// WHY: we apply the user's brand accent ONLY if it stays legible. The accent is
// used as a button background with white text, so it must have enough contrast
// against white. A garish/too-light brand color falls back to our official accent
// rather than breaking legibility. We never repaint backgrounds/text in their
// palette — only the accent token.
export const OFFICIAL_ACCENT = '#0F766E';
const WHITE = '#ffffff';
const MIN_CONTRAST_VS_WHITE = 3.0; // WCAG AA for large text / UI components

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb | null {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance(rgb: Rgb): number {
  const channel = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 1;
  const la = relativeLuminance(a) + 0.05;
  const lb = relativeLuminance(b) + 0.05;
  return la > lb ? la / lb : lb / la;
}

export interface AccentDecision {
  accent: string;
  detected: boolean; // a brand color was found on the site
  usedFallback: boolean; // brand color found but failed contrast → official accent
}

/** Decide which accent to use: the brand color if legible, else the official one. */
export function resolveAccent(brandColor: string | null): AccentDecision {
  if (!brandColor || !hexToRgb(brandColor)) {
    return { accent: OFFICIAL_ACCENT, detected: false, usedFallback: false };
  }
  if (contrastRatio(brandColor, WHITE) >= MIN_CONTRAST_VS_WHITE) {
    return { accent: brandColor, detected: true, usedFallback: false };
  }
  return { accent: OFFICIAL_ACCENT, detected: true, usedFallback: true };
}
