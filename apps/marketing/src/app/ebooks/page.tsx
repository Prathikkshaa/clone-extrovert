import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'E-Books',
  description:
    'Deeper long-form guides from the Milo editors. Each e-book is a PDF you can save, print, or share with your team.',
  alternates: { canonical: '/ebooks' },
  // Coming-soon stub: no content to index yet.
  robots: { index: false, follow: true },
};

export default function EbooksPage() {
  return (
    <section className="shell py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">
          Resources
        </p>
        <h1 className="mt-5 text-[2.25rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-[2.75rem] md:text-[3.25rem]">
          E-Books, coming soon.
        </h1>
        <p className="mt-6 text-body-lg leading-[1.55] text-muted md:text-[1.25rem]">
          {APP_NAME} editors are packaging the deeper long-form guides into PDFs
          you can save, print, or share with your team. First titles land later
          this quarter.
        </p>
        <div className="mt-10 rounded-md border border-line bg-surface p-6 md:p-7">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            Planned titles
          </p>
          <ul className="mt-4 space-y-3 text-body text-ink md:text-body-lg">
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>The buying-signal playbook, PDF edition.</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Cold email deliverability from your own inbox, 2026 edition.</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>The 90-day bootstrapped-founder outbound plan, workbook.</span>
            </li>
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-body-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            Read the blog
          </Link>
          <Link
            href="/how-it-works"
            className="text-body-sm font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
