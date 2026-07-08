import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { APP_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${APP_NAME} handles your data. Placeholder - replace with real legal text before launch.`,
  robots: { index: false, follow: true }, // placeholder legal text - keep out of the index
};

// Legal STUB (M00 §8) - clearly marked. Real text is the user's/lawyer's job.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="shell max-w-prose py-10">
        <Reveal>
          <div className="rounded-lg border border-dashed border-line bg-surface/40 p-6">
            <p className="text-body-sm font-medium text-warning">Placeholder - not legal text.</p>
            <p className="mt-3 text-body text-muted">
              This is a scaffold stub. The real privacy policy must be written/reviewed by the
              founder and a lawyer before launch. Do not ship this as-is.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
