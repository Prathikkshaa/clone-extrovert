import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { PLACEHOLDER_POSTS } from './posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical playbooks on finding local business leads, writing cold email that lands, and booking meetings without a full-time sales motion.',
};

// Blog is the SEO/AEO content engine (M00 §9). M01 scaffolds only: the hub +
// one placeholder post structure. Real posts + full SEO land in M04.
export default function BlogIndexPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Field notes on outreach that actually books meetings.">
        Practical guides for finding clients without becoming a full-time salesperson. The
        content engine gets built out in M04.
      </PageHero>

      <section className="shell py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {PLACEHOLDER_POSTS.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full rounded-lg border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <p className="text-eyebrow uppercase text-accent">{post.category}</p>
                <h2 className="mt-2 text-heading-md text-ink group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 text-body-sm text-muted">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
