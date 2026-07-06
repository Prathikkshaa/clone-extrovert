import Link from 'next/link';
import { CtaButton } from '@/components/cta-button';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[50vh] flex-col items-start justify-center py-24">
      <p className="text-eyebrow uppercase text-accent">404</p>
      <h1 className="mt-3 text-display-md text-ink">This page wandered off.</h1>
      <p className="mt-4 max-w-prose text-body-lg text-muted">
        The link may be old or mistyped. Head back home and find what you need.
      </p>
      <div className="mt-8">
        <CtaButton href="/">Back home</CtaButton>
      </div>
      <Link href="/how-it-works" className="mt-4 text-body-sm text-accent hover:text-accent-strong">
        Or see how it works →
      </Link>
    </section>
  );
}
