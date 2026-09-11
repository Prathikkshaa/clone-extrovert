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

        {/* Cluster filter. Labeled row of pills so the reader knows it filters. */}
        <div className="mt-12 flex flex-wrap items-center gap-2 border-b border-line pb-4">
          <p className="mr-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted">
            Filter by topic:
          </p>
          <nav aria-label="Filter posts by cluster" className="flex flex-wrap gap-2">
            <Link
              href="/blog#posts"
              scroll={false}
              aria-current={!activeCluster ? 'page' : undefined}
              className={
                'rounded-full border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors ' +
                (!activeCluster
                  ? 'border-accent bg-accent text-white'
                  : 'border-line text-muted hover:border-accent hover:text-accent')
              }
            >
              All ({BLOG_POSTS.length})
            </Link>
            {BLOG_CLUSTERS.map((c) => {
              const count = BLOG_POSTS.filter((p) => clusterIdFor(p) === c.id).length;
              const active = activeCluster === c.id;
              return (
                <Link
                  key={c.id}
                  href={`/blog?cluster=${c.id}#posts`}
                  scroll={false}
                  aria-current={active ? 'page' : undefined}
                  className={
                    'rounded-full border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors ' +
                    (active
                      ? 'border-accent bg-accent text-white'
                      : 'border-line text-muted hover:border-accent hover:text-accent')
                  }
                >
                  {c.label} ({count})
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Featured piece. Fixed structure so layout does not shift between filters:
          consistent h2/excerpt line clamps, fixed thumbnail aspect. */}
      {featured ? (
        <section className="shell mt-12 md:mt-16" id="posts" style={{ scrollMarginTop: '5rem' }}>
          <Link href={`/blog/${featured.slug}`} className="group grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12 md:items-start">
            <div className="flex flex-col md:min-h-[16rem]">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
                Featured · {featured.category}
              </p>
              <h2 className="mt-4 line-clamp-2 text-[1.75rem] font-medium leading-[1.15] tracking-tight text-ink transition-colors group-hover:text-accent md:text-[2.125rem] lg:text-[2.375rem]">
                {featured.title}
              </h2>
              <p className="mt-5 line-clamp-3 max-w-prose text-body-lg leading-[1.55] text-ink/85 md:text-[1.125rem]">
                {featured.excerpt ?? featured.description}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-6 text-body-sm text-muted">
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
            <div className="hidden md:block">
              <PostThumbnail
                post={featured}
                className="aspect-[5/3] w-full rounded-md border border-line"
              />
            </div>
          </Link>
        </section>
      ) : null}

      {/* Grid — consistent card structure: fixed thumbnail aspect + clamped
          title (2 lines) + clamped excerpt (3 lines) + meta row = every card
          renders the same height across every filter. */}
      <section className="shell mt-16 pb-24 md:mt-20">
        {rest.length ? (
          <ul className="grid gap-x-8 gap-y-14 border-t border-line pt-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => {
              const a = authorFor(post.slug);
              return (
                <li key={post.slug} className="flex">
                  <Link href={`/blog/${post.slug}`} className="group flex w-full flex-col">
                    <PostThumbnail
                      post={post}
                      className="aspect-[5/3] w-full rounded-md border border-line transition-colors group-hover:border-accent/40"
                    />
                    <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                      {post.category}
                    </p>
                    <h2 className="mt-2 line-clamp-2 min-h-[3rem] text-[1.25rem] font-medium leading-[1.2] tracking-tight text-ink transition-colors group-hover:text-accent md:min-h-[3.3rem] md:text-[1.375rem]">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-body leading-[1.55] text-ink/80">
                      {post.excerpt ?? post.description ?? ''}
                    </p>
                    <p className="mt-auto flex items-center gap-2 pt-5 text-body-sm text-muted">
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
            <Link href="/blog" scroll={false} className="text-accent underline underline-offset-2">
              See all posts
            </Link>
            .
          </p>
        )}
      </section>
    </>
  );
}
