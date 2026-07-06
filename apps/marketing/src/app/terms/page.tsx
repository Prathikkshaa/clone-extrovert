import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';

export const metadata: Metadata = { title: 'Terms of Service' };

// Legal STUB (M00 §8) — clearly marked. Real text is the user's/lawyer's job.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="shell max-w-prose py-10">
        <Reveal>
          <div className="rounded-lg border border-dashed border-line bg-surface/40 p-6">
            <p className="text-body-sm font-medium text-warning">Placeholder — not legal text.</p>
            <p className="mt-3 text-body text-muted">
              This is a scaffold stub. The real terms of service must be written/reviewed by the
              founder and a lawyer before launch. Do not ship this as-is.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
