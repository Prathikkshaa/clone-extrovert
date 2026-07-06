// SERVER component — a lightweight, left-aligned page header used by the secondary
// route placeholders (pricing/about/etc). Asymmetric by default (M00 §5 — not
// everything centered). Real section designs replace these in M02/M03.
import { Reveal } from './reveal';
import type { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="shell pt-16 md:pt-24">
      <Reveal className="max-w-prose">
        {eyebrow ? <p className="text-eyebrow uppercase text-accent">{eyebrow}</p> : null}
        <h1 className="mt-3 text-display-md text-ink">{title}</h1>
        {children ? <div className="mt-5 text-body-lg text-muted">{children}</div> : null}
      </Reveal>
    </section>
  );
}
