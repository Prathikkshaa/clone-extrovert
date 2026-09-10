import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { CONTACT_EMAIL } from '@/lib/site';
import { BLOG_POSTS, readMinutes } from './posts';
import { BLOG_CLUSTERS, clusterIdFor, clusterLabel } from './clusters';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical playbooks on finding local business leads, buying signals, personalized cold email, deliverability, and compliance. Written by operators, not marketers.',
  alternates: { canonical: '/blog' },
};

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function sortedPosts() {
  return [...BLOG_POSTS].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string }>;
}) {
  const params = await searchParams;
  const activeCluster = params.cluster && BLOG_CLUSTERS.some((c) => c.id === params.cluster)
    ? params.cluster
    : null;

  const all = sortedPosts();
  const filtered = activeCluster
    ? all.filter((p) => clusterIdFor(p) === activeCluster)
    : all;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <section className="shell pt-16 md:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-eyebrow uppercase text-accent">Blog</p>
          <h1 className="mt-3 text-display-md text-ink">
            Playbooks for founders who need clients, not another sales stack.
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted">
            Buying signals, local prospecting, personalized cold email, deliverability, and
            compliance. Written by operators. No fluff, no clickbait.
          </p>
        </Reveal>

        {/* Cluster pills */}
        <Reveal delay={0.05} className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={[
              'rounded-full border px-4 py-1.5 text-body-sm transition-colors',
              !activeCluster
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface text-ink hover:border-accent hover:text-accent',
            ].join(' ')}
          >
            All
          </Link>
          {BLOG_CLUSTERS.map((c) => (
            <Link
              key={c.id}
              href={`/blog?cluster=${c.id}`}
              className={[
                'rounded-full border px-4 py-1.5 text-body-sm transition-colors',
                activeCluster === c.id
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-surface text-ink hover:border-accent hover:text-accent',
              ].join(' ')}
            >
              {c.label}
            </Link>
          ))}
        </Reveal>
      </section>

      {featured ? (
        <section className="shell pt-12">
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 rounded-2xl border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-float md:grid-cols-[1.1fr_1fr] md:p-8"
            >
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
                  Featured · {featured.category}
                </p>
                <p className="mt-3 text-display-md text-ink group-hover:text-accent">
                  {featured.title}
                </p>
                <p className="mt-4 max-w-prose text-body-lg text-muted">{featured.excerpt ?? featured.description}</p>
                <p className="mt-6 text-body-sm text-muted">
                  {dateFmt(featured.datePublished)} · {readMinutes(featured)} min read
                </p>
              </div>
              <div className="flex items-end justify-end">
                <span className="rounded-full border border-line bg-canvas px-4 py-2 text-body-sm text-ink transition-colors group-hover:border-accent group-hover:text-accent">
                  Read the piece
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      {/* Newsletter capture. Mailto fallback until an audience is wired. */}
      <section className="shell pb-12 pt-6">
        <Reveal className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-2xl border border-accent bg-accent-soft/40 p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-7">
          <div className="min-w-0">
            <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
              Playbook drops
            </p>
            <p className="mt-1 text-heading-sm text-ink">
              One email when a new Milo playbook lands. No noise.
            </p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Subscribe%20to%20the%20Milo%20playbook`}
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-body-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            Subscribe by email
          </a>
        </Reveal>
      </section>

      <section className="shell py-12">
        {rest.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 0.04}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-card transition-all hover:border-accent/40 hover:shadow-float"
                >
                  <p className="text-eyebrow uppercase text-accent">{post.category}</p>
                  <h2 className="mt-2 text-heading-md text-ink group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-body-sm text-muted">{post.excerpt ?? post.description ?? post.title}</p>
                  <p className="mt-4 text-body-sm text-muted/80">
                    {dateFmt(post.dateModified ?? post.datePublished)} · {readMinutes(post)} min read
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="text-body-lg text-muted">
            No posts in {activeCluster ? clusterLabel(activeCluster) : 'this cluster'} yet.{' '}
            <Link href="/blog" className="text-accent underline underline-offset-2">
              See all posts
            </Link>
            .
          </p>
        )}
      </section>
    </>
  );
}
