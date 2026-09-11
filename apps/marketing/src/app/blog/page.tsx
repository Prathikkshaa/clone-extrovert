import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS, readMinutes } from './posts';
import { BLOG_CLUSTERS, clusterIdFor, clusterLabel } from './clusters';
import { authorFor } from './authors';
import { PostThumbnail } from './post-thumbnail';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const activeCluster = params.cluster && BLOG_CLUSTERS.some((c) => c.id === params.cluster)
    ? params.cluster
    : null;
  const base: Metadata = {
    title: activeCluster ? `${clusterLabel(activeCluster)} — Milo blog` : 'Blog',
    description:
      'Practical playbooks on finding local business leads, buying signals, personalized cold email, deliverability, and compliance. Written by operators, not marketers.',
    alternates: { canonical: '/blog' },
  };
  if (activeCluster) {
    // Filtered variants noindex; canonical points at /blog to consolidate PageRank.
    base.robots = { index: false, follow: true };
  }
  return base;
}

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
      {/* Editorial masthead. Matches the article page rhythm; no dashboard cards. */}
      <section className="shell pt-14 md:pt-20">
        <div className="max-w-4xl">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">
            The Milo blog
          </p>
          <h1 className="mt-5 text-[2.25rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem]">
            Playbooks for founders who need clients, not another sales stack.
          </h1>
          <p className="mt-6 max-w-2xl text-[1.25rem] leading-[1.5] text-muted md:text-[1.375rem]">
            Buying signals, local prospecting, personalized cold email, deliverability, and
            compliance. Written by operators. No fluff, no clickbait.
          </p>
        </div>

        {/* Cluster filter. Editorial pill-row, not dashboard tags. */}
        <nav aria-label="Filter posts by cluster" className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-4">
          <Link
            href="/blog"
            className={
              'font-mono text-[0.75rem] uppercase tracking-[0.14em] transition-colors ' +
              (!activeCluster
                ? 'text-accent'
                : 'text-muted hover:text-ink')
            }
          >
            All posts
          </Link>
          {BLOG_CLUSTERS.map((c) => (
            <Link
              key={c.id}
              href={`/blog?cluster=${c.id}`}
              className={
                'font-mono text-[0.75rem] uppercase tracking-[0.14em] transition-colors ' +
                (activeCluster === c.id
                  ? 'text-accent'
                  : 'text-muted hover:text-ink')
              }
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Featured piece. Editorial hero. No card frame; typography-forward. */}
      {featured ? (
        <section className="shell mt-12 md:mt-16">
          <Link href={`/blog/${featured.slug}`} className="group grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
                Featured · {featured.category}
              </p>
              <h2 className="mt-4 text-[2rem] font-medium leading-[1.1] tracking-tight text-ink transition-colors group-hover:text-accent md:text-[2.5rem] lg:text-[2.75rem]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-prose text-body-lg leading-[1.55] text-ink/85 md:text-[1.25rem]">
                {featured.excerpt ?? featured.description}
              </p>
              <div className="mt-6 flex items-center gap-3 text-body-sm text-muted">
                {(() => {
                  const a = authorFor(featured.slug);
                  return (
                    <>
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft font-mono text-[0.65rem] text-accent">
                        {a.initials}
                      </span>
                      <span className="text-ink">{a.name}</span>
                      <span aria-hidden>·</span>
                    </>
                  );
                })()}
                <span>{dateFmt(featured.datePublished)}</span>
                <span aria-hidden>·</span>
                <span>{readMinutes(featured)} min read</span>
              </div>
            </div>
            {/* Right column: themed cover figure (image SEO surface) */}
            <div className="hidden md:block">
              <PostThumbnail
                post={featured}
                className="aspect-[5/3] w-full rounded-md border border-line"
              />
            </div>
          </Link>
        </section>
      ) : null}

      {/* Grid — editorial-restrained, no shadow cards. Just typography, hover shift. */}
      <section className="shell mt-16 pb-24 md:mt-20">
        {rest.length ? (
          <ul className="grid gap-x-8 gap-y-14 border-t border-line pt-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => {
              const a = authorFor(post.slug);
              return (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <PostThumbnail
                      post={post}
                      className="aspect-[5/3] w-full rounded-md border border-line transition-colors group-hover:border-accent/40"
                    />
                    <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                      {post.category}
                    </p>
                    <h2 className="mt-2 text-[1.25rem] font-medium leading-[1.2] tracking-tight text-ink transition-colors group-hover:text-accent md:text-[1.375rem]">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-body leading-[1.55] text-ink/80">
                      {post.excerpt ?? post.description ?? ''}
                    </p>
                    <p className="mt-5 flex items-center gap-2 text-body-sm text-muted">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft font-mono text-[0.6rem] text-accent">
                        {a.initials}
                      </span>
                      <span>{a.name}</span>
                      <span aria-hidden>·</span>
                      <span>{dateFmt(post.dateModified ?? post.datePublished)}</span>
                      <span aria-hidden>·</span>
                      <span>{readMinutes(post)} min</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="border-t border-line pt-14 text-body-lg text-muted">
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
