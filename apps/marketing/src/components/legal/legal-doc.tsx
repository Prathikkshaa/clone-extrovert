// SERVER. Layout shell for /privacy, /terms, /security. Kept minimal: a header
// with title + effective/updated dates, a sticky-on-desktop table of contents,
// and a single reading column with token-driven typography.
import type { ReactNode } from 'react';
import { Reveal } from '@/components/reveal';
import { formatLegalDate } from '@/lib/legal';

export type LegalTocEntry = { id: string; label: string };

export function LegalDoc({
  eyebrow,
  title,
  effectiveDate,
  lastUpdated,
  lead,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  lastUpdated?: string;
  lead: ReactNode;
  toc: LegalTocEntry[];
  children: ReactNode;
}) {
  return (
    <>
      <section className="shell pt-16 md:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-eyebrow uppercase text-accent">{eyebrow}</p>
          <h1 className="mt-3 text-display-md text-ink">{title}</h1>
          <p className="mt-4 font-mono text-body-sm text-muted">
            Effective {formatLegalDate(effectiveDate)}
            {lastUpdated && lastUpdated !== effectiveDate
              ? ` · Last updated ${formatLegalDate(lastUpdated)}`
              : ''}
          </p>
          <div className="mt-6 max-w-2xl text-body-lg text-muted">{lead}</div>
        </Reveal>
      </section>

      <section className="shell pb-section-y pt-10 md:pt-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-14">
          <aside className="md:sticky md:top-24 md:self-start">
            <p className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
              Contents
            </p>
            <ol className="mt-4 space-y-2">
              {toc.map((t, i) => (
                <li key={t.id} className="grid grid-cols-[auto_1fr] items-baseline gap-3">
                  <span className="font-mono text-body-sm text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <a
                    href={`#${t.id}`}
                    className="text-body-sm text-ink transition-colors hover:text-accent"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="min-w-0 max-w-3xl [&_h2]:mt-14 [&_h2]:scroll-mt-24 [&_h2]:text-heading-lg [&_h2]:text-ink [&_h2:first-of-type]:mt-0 [&_h3]:mt-8 [&_h3]:text-heading-sm [&_h3]:text-ink [&_p]:mt-4 [&_p]:text-body [&_p]:text-ink/85 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ul_li]:text-body [&_ul_li]:text-ink/85 [&_ul_li]:marker:text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent-strong [&_strong]:font-medium [&_strong]:text-ink">
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
