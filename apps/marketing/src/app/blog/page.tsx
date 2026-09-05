import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { BLOG_POSTS } from './posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical playbooks on finding local business leads, writing cold email that lands, and booking meetings without a full-time sales motion.',
  alternates: { canonical: '/blog' },
};

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// Blog is the SEO/AEO content engine (M00 §9). Posts come from ./posts.
export default function BlogIndexPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Field notes on outreach that actually books meetings.">
        Practical guides for finding clients without becoming a full-time salesperson.
      </PageHero>

      <section className="shell py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {BLOG_POSTS.map((post, i) => (
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
                <p className="mt-4 text-body-sm text-muted/80">
                  {dateFmt(post.datePublished)} · {post.readMinutes} min read
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
