import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/reveal';
import { APP_NAME, SITE_URL } from '@/lib/site';
import { BLOG_POSTS, getPost, postDescription, readMinutes, type Block } from '../posts';
import { relatedFor, clusterIdFor, clusterLabel } from '../clusters';
import { authorFor } from '../authors';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: postDescription(post),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: postDescription(post),
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
    },
  };
}

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Block renderer. Editorial-first:
 * - Text blocks use a comfortable 44rem measure at the article body level.
 * - Diagram / table blocks BREAK OUT to a wider bleed via `.article-bleed`,
 *   so heavy data sits at ~64rem while prose sits at ~44rem.
 * - No rounded card frames unless the content earns them (FAQ, CTA).
 */
function BlockView({ block }: { block: Block }) {
  if (block.type === 'h2') {
    const id = block.id ?? slugify(block.text);
    return (
      <h2
        id={id}
        className="scroll-mt-24 mt-16 text-[1.75rem] font-medium leading-[1.2] tracking-tight text-ink md:text-[2rem]"
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === 'h3') {
    const id = block.id ?? slugify(block.text);
    return (
      <h3
        id={id}
        className="scroll-mt-24 mt-10 text-[1.25rem] font-medium leading-[1.3] tracking-tight text-ink md:text-[1.375rem]"
      >
        {block.text}
      </h3>
    );
  }
  if (block.type === 'ul') {
    return (
      <ul className="list-disc space-y-2.5 pl-5 text-[1.0625rem] leading-[1.75] text-ink/85 marker:text-accent md:text-[1.125rem]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'ol') {
    return (
      <ol className="list-decimal space-y-2.5 pl-5 text-[1.0625rem] leading-[1.75] text-ink/85 marker:text-accent md:text-[1.125rem]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }
  if (block.type === 'link') {
    // Subtle inline referral. NOT a card. NOT a container. Just text.
    return (
      <p className="border-l-2 border-accent pl-4 text-[1rem] leading-[1.7] text-ink/85">
        {block.text}{' '}
        <Link
          href={block.href}
          className="font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
        >
          {block.label}
        </Link>
        .
      </p>
    );
  }
  if (block.type === 'tldr') {
    // NOT a card. A typographic lead: mono eyebrow + emphasized paragraph.
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          TL;DR
        </p>
        <p className="mt-3 text-[1.25rem] font-normal leading-[1.55] text-ink md:text-[1.35rem]">
          {block.text}
        </p>
      </div>
    );
  }
  if (block.type === 'callout') {
    // Editorial pull, not a UI card. Left accent stripe, no rounded box.
    return (
      <aside className="border-l-2 border-accent pl-5 md:pl-6">
        {block.title ? (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            {block.title}
          </p>
        ) : null}
        <p className="mt-2 text-[1.0625rem] leading-[1.7] text-ink/90 md:text-[1.125rem]">
          {block.text}
        </p>
      </aside>
    );
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="relative pl-8 md:pl-10">
        <span
          aria-hidden
          className="absolute -left-1 -top-2 font-serif text-[3.5rem] leading-none text-accent/40 md:text-[4.5rem]"
        >
          &ldquo;
        </span>
        <p className="text-[1.375rem] italic leading-[1.5] text-ink md:text-[1.625rem]">
          {block.text}
        </p>
        {block.cite ? (
          <cite className="mt-3 block text-body-sm not-italic text-muted">— {block.cite}</cite>
        ) : null}
      </blockquote>
    );
  }
  if (block.type === 'steps') {
    // Editorial list. Big mono digit, heading, body. No card frame.
    return (
      <ol className="space-y-8">
        {block.items.map((it, i) => (
          <li key={i} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            <span className="font-mono text-[1.5rem] leading-none text-accent/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-[1.125rem] font-medium leading-tight text-ink md:text-[1.25rem]">
                {it.title}
              </p>
              <p className="mt-2 text-[1.0625rem] leading-[1.7] text-ink/85 md:text-[1.125rem]">
                {it.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === 'table') {
    // Full-width bleed. Data tables sit wider than the prose measure.
    return (
      <figure className="article-bleed">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ink/20">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="py-4 pr-4 text-left font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="py-4 pr-4 align-top text-[0.95rem] leading-[1.6] text-ink/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.caption ? (
          <figcaption className="mt-3 text-body-sm text-muted">{block.caption}</figcaption>
        ) : null}
      </figure>
    );
  }
  if (block.type === 'stat') {
    return (
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[3rem] leading-none text-accent">{block.value}</span>
        <span className="text-body-lg text-muted">{block.label}</span>
      </div>
    );
  }
  if (block.type === 'faq') {
    return (
      <div className="space-y-8">
        {block.items.map((qa, i) => (
          <div key={i}>
            <h3 className="text-[1.125rem] font-medium leading-snug text-ink md:text-[1.25rem]">
              {qa.q}
            </h3>
            <p className="mt-3 text-[1.0625rem] leading-[1.7] text-ink/85 md:text-[1.125rem]">
              {qa.a}
            </p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'diagram') return <DiagramView block={block} />;
  if (block.type === 'newsletter') return null;
  return (
    <p className="text-[1.0625rem] leading-[1.75] text-ink/90 md:text-[1.125rem]">{block.text}</p>
  );
}

/* ── Diagram renderer. Full-bleed. SVG, token-driven, dark-safe. ── */
type DiagramBlock = Extract<Block, { type: 'diagram' }>;
function DiagramView({ block }: { block: DiagramBlock }) {
  const nodeMap = new Map(block.nodes.map((n, i) => [n.id, { ...n, i }]));
  const cols = block.kind === 'ladder' ? 1 : block.kind === 'matrix' ? 2 : Math.min(block.nodes.length, 4);
  const rows = Math.ceil(block.nodes.length / cols);
  const nodeW = 220;
  const nodeH = 88;
  const gapX = 40;
  const gapY = 32;
  const width = cols * nodeW + (cols - 1) * gapX + 40;
  const height = rows * nodeH + (rows - 1) * gapY + 40;
  const position = (i: number) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return { x: 20 + c * (nodeW + gapX), y: 20 + r * (nodeH + gapY) };
  };
  return (
    <figure className="article-bleed">
      <figcaption className="mb-5">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          {block.kind.replace('-', ' ')}
        </p>
        <p className="mt-1 text-[1.25rem] font-medium leading-snug text-ink md:text-[1.375rem]">
          {block.title}
        </p>
      </figcaption>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={block.title}
          className="min-w-[34rem]"
        >
          <defs>
            <marker id={`${block.kind}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--color-muted))" />
            </marker>
          </defs>
          {block.edges?.map((e, i) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            const pa = position(a.i);
            const pb = position(b.i);
            const x1 = pa.x + nodeW / 2;
            const y1 = pa.y + nodeH / 2;
            const x2 = pb.x + nodeW / 2;
            const y2 = pb.y + nodeH / 2;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgb(var(--color-line))"
                  strokeWidth="1.5"
                  markerEnd={`url(#${block.kind}-arrow)`}
                />
                {e.label ? (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    className="fill-[rgb(var(--color-muted))] font-mono text-[10px]"
                  >
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {block.nodes.map((n, i) => {
            const { x, y } = position(i);
            const isE = n.emphasis;
            return (
              <g key={n.id}>
                <rect
                  x={x}
                  y={y}
                  width={nodeW}
                  height={nodeH}
                  rx="10"
                  fill={isE ? 'rgb(var(--color-accent))' : 'rgb(var(--color-canvas))'}
                  stroke={isE ? 'rgb(var(--color-accent-strong))' : 'rgb(var(--color-line))'}
                  strokeWidth="1"
                />
                <text
                  x={x + 16}
                  y={y + 26}
                  className={isE ? 'fill-white text-[13px] font-medium' : 'fill-[rgb(var(--color-ink))] text-[13px] font-medium'}
                >
                  {n.label}
                </text>
                {n.sub ? (
                  <text
                    x={x + 16}
                    y={y + 52}
                    className={isE ? 'fill-white/80 text-[11px]' : 'fill-[rgb(var(--color-muted))] text-[11px]'}
                  >
                    {n.sub.length > 32 ? n.sub.slice(0, 30) + '...' : n.sub}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      {block.caption ? (
        <figcaption className="mt-3 text-body-sm text-muted">{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ── Page ── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const clusterId = clusterIdFor(post);
  const related = relatedFor(post, 3);
  const author = authorFor(post.slug);

  const faqBlocks = post.body.filter((b): b is Extract<Block, { type: 'faq' }> => b.type === 'faq');
  const stepsBlocks = post.body.filter((b): b is Extract<Block, { type: 'steps' }> => b.type === 'steps');

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: postDescription(post),
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: `${SITE_URL}/blog/authors/${author.id}`,
      jobTitle: author.role,
    },
    publisher: { '@type': 'Organization', name: APP_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    url: `${SITE_URL}/blog/${post.slug}`,
    articleSection: post.category,
    keywords: post.tags?.join(', '),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  const faqLd = faqBlocks.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqBlocks.flatMap((b) =>
          b.items.map((qa) => ({
            '@type': 'Question',
            name: qa.q,
            acceptedAnswer: { '@type': 'Answer', text: qa.a },
          })),
        ),
      }
    : null;

  const howToLd = stepsBlocks.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.title,
        step: stepsBlocks[0].items.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.text,
        })),
      }
    : null;

  return (
    <article className="article-root">
      <style>{`
        .article-root {
          --article-measure: 44rem;
          --article-bleed: 64rem;
          padding-block: clamp(3rem, 4vw, 5rem) clamp(4rem, 6vw, 7rem);
        }
        .article-shell {
          width: min(100% - 2.5rem, var(--article-bleed));
          margin-inline: auto;
        }
        .article-measure {
          width: min(100%, var(--article-measure));
          margin-inline: auto;
        }
        .article-body > * {
          width: min(100%, var(--article-measure));
          margin-inline: auto;
        }
        .article-body > figure.article-bleed {
          width: min(100%, var(--article-bleed));
        }
        .article-body > * + * {
          margin-top: 1.5rem;
        }
        .article-body > h2 + * {
          margin-top: 1.25rem;
        }
        .article-body > h3 + * {
          margin-top: 1rem;
        }
        .article-body > figure.article-bleed + * {
          margin-top: 3rem;
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} /> : null}
      {howToLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd).replace(/</g, '\\u003c') }} /> : null}

      {/* Editorial hero. Left-aligned, generous vertical rhythm, no card. */}
      <header className="article-shell">
        <Reveal className="article-measure">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-body-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-ink">Blog</Link>
            {clusterId ? (
              <>
                <span aria-hidden>/</span>
                <Link href={`/blog?cluster=${clusterId}`} className="hover:text-ink">
                  {clusterLabel(clusterId)}
                </Link>
              </>
            ) : null}
          </nav>

          <p className="mt-10 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">
            {post.category}
          </p>

          <h1 className="mt-4 text-[2.25rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]">
            {post.title}
          </h1>

          <p className="mt-6 text-[1.25rem] leading-[1.5] text-muted md:text-[1.375rem]">
            {postDescription(post)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-body-sm text-muted">
            <Link href={`/blog/authors/${author.id}`} className="inline-flex items-center gap-2 text-ink hover:text-accent">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft font-mono text-[0.72rem] text-accent">
                {author.initials}
              </span>
              <span className="font-medium">{author.name}</span>
            </Link>
            <span className="text-muted">{author.role}</span>
            <span aria-hidden className="hidden h-3 w-px bg-line md:block" />
            <span>{dateFmt(post.datePublished)}</span>
            {post.dateModified && post.dateModified !== post.datePublished ? (
              <>
                <span aria-hidden className="hidden h-3 w-px bg-line md:block" />
                <span>Updated {dateFmt(post.dateModified)}</span>
              </>
            ) : null}
            <span aria-hidden className="hidden h-3 w-px bg-line md:block" />
            <span>{readMinutes(post)} min read</span>
          </div>
        </Reveal>
      </header>

      {/* Article body. Text at 44rem measure, diagrams / tables bleed to 64rem. */}
      <div className="article-shell mt-16">
        <div className="article-body">
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
      </div>

      {/* Editorial footer: Milo CTA (contextual), author bio, related. */}
      <div className="article-shell mt-24">
        <div className="article-measure">
          {/* Contextual product callout. Not a giant card — a thin editorial rule. */}
          <div className="border-t border-b border-line py-8">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
              From {APP_NAME}
            </p>
            <p className="mt-3 text-[1.25rem] leading-[1.45] text-ink md:text-[1.375rem]">
              {APP_NAME} runs this loop end to end. Find the right businesses, personalize
              the outreach, send it from your own inbox.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-body-sm">
              <Link href="/how-it-works" className="font-medium text-accent underline underline-offset-4 hover:text-accent-strong">
                See how it works
              </Link>
              <Link href="/pricing" className="font-medium text-accent underline underline-offset-4 hover:text-accent-strong">
                Pricing
              </Link>
            </div>
          </div>

          {/* Author line. Just typography. */}
          <div className="mt-12 flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-body-sm text-accent">
              {author.initials}
            </span>
            <div className="min-w-0">
              <p className="text-body-sm text-muted">Written by</p>
              <Link href={`/blog/authors/${author.id}`} className="text-heading-sm text-ink hover:text-accent">
                {author.name}
              </Link>
              <p className="mt-1 text-body-sm text-muted">{author.role}</p>
              <p className="mt-3 max-w-prose text-body text-ink/85">{author.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related — minimal, no heavy borders. */}
      {related.length ? (
        <Reveal delay={0.05} className="article-shell mt-20">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              Keep reading
            </p>
            <Link href="/blog" className="text-body-sm text-accent hover:text-accent-strong">
              All posts
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {related.map((r) => {
              const ra = authorFor(r.slug);
              return (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                      {r.category}
                    </p>
                    <p className="mt-3 text-[1.125rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent md:text-[1.25rem]">
                      {r.title}
                    </p>
                    <p className="mt-3 text-body-sm text-muted">
                      {ra.name} · {readMinutes(r)} min read
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      ) : null}
    </article>
  );
}
