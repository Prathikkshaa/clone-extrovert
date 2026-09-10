import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/reveal';
import { APP_NAME, SITE_URL, SIGNUP_URL } from '@/lib/site';
import { BLOG_POSTS, getPost, postDescription, readMinutes, wordCount, heroQuote, type Block } from '../posts';
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
  const displayTitle = post.seoTitle ?? post.title;
  const desc = postDescription(post);
  return {
    title: displayTitle,
    description: desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: displayTitle,
      description: desc,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: desc,
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
      <ul className="list-disc space-y-2.5 pl-5 text-[1.0625rem] leading-[1.75] text-ink/90 marker:text-accent md:text-[1.125rem]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'ol') {
    return (
      <ol className="list-decimal space-y-2.5 pl-5 text-[1.0625rem] leading-[1.75] text-ink/90 marker:text-accent md:text-[1.125rem]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }
  if (block.type === 'link') {
    // Subtle inline referral. NOT a card. NOT a container. Just text.
    return (
      <p className="border-l-2 border-accent pl-4 text-[1rem] leading-[1.7] text-ink/90">
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
    // Semantic <section role="doc-abstract"> so screen readers announce it as a summary.
    return (
      <section role="doc-abstract" aria-label="Summary">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          TL;DR
        </p>
        <p className="mt-3 text-[1.25rem] font-normal leading-[1.55] text-ink md:text-[1.35rem]">
          {block.text}
        </p>
      </section>
    );
  }
  if (block.type === 'callout') {
    // Editorial pull, not a UI card. Left accent stripe, no rounded box.
    // role="note" so assistive tech announces it as inline commentary, not tangential aside.
    return (
      <div role="note" className="border-l-2 border-accent pl-5 md:pl-6">
        {block.title ? (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            {block.title}
          </p>
        ) : null}
        <p className="mt-2 text-[1.0625rem] leading-[1.7] text-ink md:text-[1.125rem]">
          {block.text}
        </p>
      </div>
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
              <p className="mt-2 text-[1.0625rem] leading-[1.7] text-ink/90 md:text-[1.125rem]">
                {it.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === 'table') {
    // Native table at md+; stacked card list on mobile. No horizontal scroll on phone.
    return (
      <figure className="article-bleed">
        {/* Desktop / tablet: real table */}
        <table className="hidden w-full border-collapse text-body-sm md:table">
          <thead>
            <tr className="border-b border-ink/20">
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
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
                  <td key={j} className="py-4 pr-4 align-top text-[0.95rem] leading-[1.6] text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile: card list. Each row becomes a labelled card. */}
        <ul className="space-y-4 md:hidden" role="list">
          {block.rows.map((row, i) => (
            <li key={i} className="rounded-lg border border-line bg-canvas p-4">
              <dl className="space-y-2">
                {row.map((cell, j) => (
                  <div key={j}>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                      {block.headers[j]}
                    </dt>
                    <dd className="mt-1 text-[0.95rem] leading-[1.5] text-ink">{cell}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        {block.caption ? (
          <figcaption className="mt-4 text-body-sm text-muted">{block.caption}</figcaption>
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
            <p className="mt-3 text-[1.0625rem] leading-[1.7] text-ink/90 md:text-[1.125rem]">
              {qa.a}
            </p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'diagram') return <DiagramView block={block} />;
  if (block.type === 'takeaway') {
    // Genuine editorial takeaway. Larger measure, no product plug.
    return (
      <section role="doc-conclusion" aria-label="Takeaway" className="mt-6 border-y border-line py-8">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">
          {block.title ?? 'The takeaway'}
        </p>
        <p className="mt-4 text-[1.375rem] font-normal leading-[1.45] text-ink md:text-[1.5rem]">
          {block.text}
        </p>
      </section>
    );
  }
  if (block.type === 'who-this-is-for') {
    return (
      <aside aria-label="Who this is for" className="rounded-md bg-accent-soft/50 p-6 md:p-7">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          Who this is for
        </p>
        <ul className="mt-3 space-y-2 text-[1.0625rem] leading-[1.6] text-ink md:text-[1.125rem]">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
  if (block.type === 'product-moment') {
    // Contextual product callout tied to a specific insight. Left stripe + CTA.
    return (
      <aside aria-label="From Milo" className="border-l-2 border-accent bg-accent-soft/30 py-6 pl-6 pr-5">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          {block.hook}
        </p>
        <p className="mt-3 text-[1.0625rem] leading-[1.6] text-ink md:text-[1.125rem]">
          {block.text}
        </p>
        {block.ctaLabel && block.ctaHref ? (
          <Link
            href={block.ctaHref}
            className="mt-4 inline-flex items-center rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {block.ctaLabel}
          </Link>
        ) : null}
      </aside>
    );
  }
  return (
    <p className="text-[1.0625rem] leading-[1.75] text-ink/90 md:text-[1.125rem]">{block.text}</p>
  );
}

/* ── Diagram renderer. Per-kind layouts. Mobile-native (no h-scroll). ── */
type DiagramBlock = Extract<Block, { type: 'diagram' }>;

function DiagramHeader({ block }: { block: DiagramBlock }) {
  const label =
    block.kind === 'workflow' ? 'Workflow' :
    block.kind === 'decision-tree' ? 'Decision tree' :
    block.kind === 'matrix' ? 'Two-axis matrix' :
    block.kind === 'ladder' ? 'Ladder' :
    'Comparison';
  return (
    <figcaption className="mb-6">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
        {label}
      </p>
      <p className="mt-1 text-[1.25rem] font-medium leading-snug text-ink md:text-[1.375rem]">
        {block.title}
      </p>
    </figcaption>
  );
}

function LadderView({ block }: { block: DiagramBlock }) {
  // Vertical rungs with connector line. Reads top-to-bottom on every viewport.
  return (
    <div className="relative">
      <span aria-hidden className="absolute left-4 top-2 bottom-2 w-px bg-line md:left-6" />
      <ol className="space-y-5">
        {block.nodes.map((n, i) => (
          <li key={n.id} className="relative flex items-start gap-4 md:gap-6">
            <span
              className={
                'z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[0.72rem] md:h-12 md:w-12 md:text-body-sm ' +
                (n.emphasis
                  ? 'bg-accent text-white'
                  : 'bg-canvas text-muted ring-1 ring-line')
              }
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="pt-1.5 md:pt-3">
              <p className={'text-body md:text-body-lg ' + (n.emphasis ? 'font-medium text-ink' : 'text-ink')}>
                {n.label}
              </p>
              {n.sub ? (
                <p className="mt-1 text-body-sm text-muted md:text-body">{n.sub}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WorkflowView({ block }: { block: DiagramBlock }) {
  // Horizontal chain on desktop; stacked cards with down-arrows on mobile.
  return (
    <>
      {/* Desktop: horizontal chain */}
      <ol className="hidden md:flex md:flex-wrap md:items-stretch md:gap-3">
        {block.nodes.map((n, i) => (
          <li key={n.id} className="flex items-stretch gap-3">
            <div
              className={
                'w-52 rounded-lg border p-4 ' +
                (n.emphasis
                  ? 'border-accent-strong bg-accent text-white'
                  : 'border-line bg-canvas text-ink')
              }
            >
              <p className={'font-mono text-[0.68rem] uppercase tracking-[0.14em] ' + (n.emphasis ? 'text-white/80' : 'text-accent')}>
                Step {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 text-body font-medium leading-snug">{n.label}</p>
              {n.sub ? (
                <p className={'mt-1 text-body-sm ' + (n.emphasis ? 'text-white/85' : 'text-muted')}>{n.sub}</p>
              ) : null}
            </div>
            {i < block.nodes.length - 1 ? (
              <div aria-hidden className="flex items-center text-muted">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {/* Mobile: stacked with down-arrows */}
      <ol className="space-y-3 md:hidden">
        {block.nodes.map((n, i) => (
          <li key={n.id}>
            <div
              className={
                'rounded-lg border p-4 ' +
                (n.emphasis
                  ? 'border-accent-strong bg-accent text-white'
                  : 'border-line bg-canvas text-ink')
              }
            >
              <p className={'font-mono text-[0.68rem] uppercase tracking-[0.14em] ' + (n.emphasis ? 'text-white/80' : 'text-accent')}>
                Step {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 text-body font-medium leading-snug">{n.label}</p>
              {n.sub ? (
                <p className={'mt-1 text-body-sm ' + (n.emphasis ? 'text-white/85' : 'text-muted')}>{n.sub}</p>
              ) : null}
            </div>
            {i < block.nodes.length - 1 ? (
              <div aria-hidden className="flex justify-center py-2 text-muted">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v13m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </>
  );
}

function MatrixView({ block }: { block: DiagramBlock }) {
  // 2x2 grid at md+, single column below.
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {block.nodes.map((n) => (
        <div
          key={n.id}
          className={
            'rounded-lg border p-5 md:p-6 ' +
            (n.emphasis
              ? 'border-accent-strong bg-accent text-white'
              : 'border-line bg-canvas text-ink')
          }
        >
          <p className={'text-body-lg font-medium leading-snug ' + (n.emphasis ? '' : '')}>
            {n.label}
          </p>
          {n.sub ? (
            <p className={'mt-2 text-body ' + (n.emphasis ? 'text-white/90' : 'text-muted')}>{n.sub}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CompareView({ block }: { block: DiagramBlock }) {
  // Side-by-side on md+, stacked on mobile. Best when nodes.length === 2.
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      {block.nodes.map((n) => (
        <div
          key={n.id}
          className={
            'rounded-lg border p-5 md:p-6 ' +
            (n.emphasis
              ? 'border-accent-strong bg-accent text-white'
              : 'border-line bg-canvas text-ink')
          }
        >
          <p className={'font-mono text-[0.68rem] uppercase tracking-[0.14em] ' + (n.emphasis ? 'text-white/85' : 'text-accent')}>
            {n.emphasis ? 'Recommended' : 'Alternative'}
          </p>
          <p className="mt-2 text-heading-sm font-medium leading-snug">{n.label}</p>
          {n.sub ? (
            <p className={'mt-2 text-body ' + (n.emphasis ? 'text-white/90' : 'text-muted')}>{n.sub}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DecisionTreeView({ block }: { block: DiagramBlock }) {
  // Vertical decision tree via nested ol. Edge labels become branch text.
  const nodeMap = new Map(block.nodes.map((n) => [n.id, n]));
  const outgoing = new Map<string, { to: string; label?: string }[]>();
  const inbound = new Map<string, number>();
  for (const n of block.nodes) inbound.set(n.id, 0);
  for (const e of block.edges ?? []) {
    if (!outgoing.has(e.from)) outgoing.set(e.from, []);
    outgoing.get(e.from)!.push({ to: e.to, label: e.label });
    inbound.set(e.to, (inbound.get(e.to) ?? 0) + 1);
  }
  const roots = block.nodes.filter((n) => (inbound.get(n.id) ?? 0) === 0);
  const seen = new Set<string>();
  const renderNode = (id: string, branchLabel?: string, depth = 0): ReactNode => {
    if (seen.has(id)) return null;
    seen.add(id);
    const n = nodeMap.get(id);
    if (!n) return null;
    const children = outgoing.get(id) ?? [];
    return (
      <li key={id} className={depth === 0 ? '' : 'mt-4'}>
        {branchLabel ? (
          <p className="mb-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">
            {branchLabel}
          </p>
        ) : null}
        <div
          className={
            'rounded-lg border p-4 ' +
            (n.emphasis ? 'border-accent-strong bg-accent text-white' : 'border-line bg-canvas text-ink')
          }
        >
          <p className="text-body font-medium leading-snug">{n.label}</p>
          {n.sub ? (
            <p className={'mt-1 text-body-sm ' + (n.emphasis ? 'text-white/85' : 'text-muted')}>{n.sub}</p>
          ) : null}
        </div>
        {children.length ? (
          <ul className="mt-3 space-y-2 border-l border-line pl-5 md:pl-6">
            {children.map((c) => renderNode(c.to, c.label, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  };
  return (
    <ol className="space-y-3">
      {roots.map((r) => renderNode(r.id))}
      {/* Fallback: any orphan node not connected via edges */}
      {block.nodes.filter((n) => !seen.has(n.id)).map((n) => renderNode(n.id))}
    </ol>
  );
}

function DiagramView({ block }: { block: DiagramBlock }) {
  return (
    <figure className="article-bleed">
      <DiagramHeader block={block} />
      {block.kind === 'ladder' ? (
        <LadderView block={block} />
      ) : block.kind === 'matrix' ? (
        <MatrixView block={block} />
      ) : block.kind === 'compare' ? (
        <CompareView block={block} />
      ) : block.kind === 'decision-tree' ? (
        <DecisionTreeView block={block} />
      ) : (
        <WorkflowView block={block} />
      )}
      {block.caption ? (
        <figcaption className="mt-4 text-body-sm text-muted">{block.caption}</figcaption>
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
    headline: post.seoTitle ?? post.title,
    description: postDescription(post),
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: `${SITE_URL}/blog/authors/${author.id}`,
      jobTitle: author.role,
      description: author.bio,
      worksFor: { '@type': 'Organization', name: APP_NAME, url: SITE_URL },
      ...(author.sameAs && author.sameAs.length ? { sameAs: author.sameAs } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    url: `${SITE_URL}/blog/${post.slug}`,
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: wordCount(post),
    inLanguage: 'en',
    isPartOf: { '@type': 'Blog', name: `${APP_NAME} blog`, url: `${SITE_URL}/blog` },
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

  // Only emit FAQPage if we have >= 4 questions AND none of them duplicate an H2.
  // Google penalizes FAQ spam that recycles heading text.
  const h2Texts = new Set(
    post.body.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2').map((b) => b.text.toLowerCase().trim()),
  );
  const allFaqItems = faqBlocks.flatMap((b) => b.items);
  const nonDupFaq = allFaqItems.filter((qa) => !h2Texts.has(qa.q.toLowerCase().replace(/[?.!]+$/, '').trim()));
  const faqLd = nonDupFaq.length >= 4
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: nonDupFaq.map((qa) => ({
          '@type': 'Question',
          name: qa.q,
          acceptedAnswer: { '@type': 'Answer', text: qa.a },
        })),
      }
    : null;

  // HowTo only when the post explicitly opts in via `emitHowTo: true`. Google
  // suppressed HowTo rich results on desktop and restricts it to physical tasks.
  const howToLd = post.emitHowTo && stepsBlocks.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.seoTitle ?? post.title,
        step: stepsBlocks[0].items.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.text,
        })),
      }
    : null;

  const heroPullQuote = heroQuote(post);
  const minutes = readMinutes(post);
  const showStickyRail = minutes >= 6;
  const trimQuote = (q: string) => (q.length > 220 ? q.slice(0, 217).trimEnd() + '…' : q);

  return (
    <article className="article-root">
      <style>{`
        .article-root {
          --article-measure: 44rem;
          --article-bleed: 64rem;
          padding-block: clamp(3rem, 4vw, 5rem) clamp(4rem, 6vw, 7rem);
        }
        .article-shell {
          width: min(100% - 2rem, var(--article-bleed));
          margin-inline: auto;
        }
        @media (min-width: 640px) {
          .article-shell { width: min(100% - 2.5rem, var(--article-bleed)); }
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
        .article-body > * + * { margin-top: 1.75rem; }
        .article-body > h2 { margin-top: 4rem; }
        .article-body > h3 { margin-top: 2.5rem; }
        .article-body > h2 + * { margin-top: 1.25rem; }
        .article-body > h3 + * { margin-top: 1rem; }
        .article-body > figure.article-bleed { margin-top: 3rem; }
        .article-body > figure.article-bleed + * { margin-top: 3rem; }
        .article-body > section[role="doc-conclusion"] { margin-top: 4rem; }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} /> : null}
      {howToLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd).replace(/</g, '\\u003c') }} /> : null}

      {/* Editorial hero. No Reveal wrap so H1 paints immediately (LCP). */}
      <header className="article-shell">
        <div className="article-measure">
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

          <h1 className="mt-4 text-[2.25rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]">
            {post.title}
          </h1>

          <p className="mt-6 text-[1.25rem] leading-[1.5] text-muted md:text-[1.375rem]">
            {postDescription(post)}
          </p>

          {/* Pull-quote hero. Signature visual anchor per article; auto-extracted. */}
          {heroPullQuote ? (
            <figure className="mt-12 border-y border-accent/40 bg-accent-soft/40 px-6 py-8 md:px-10 md:py-10">
              <span
                aria-hidden
                className="block font-serif text-[3rem] leading-none text-accent md:text-[3.5rem]"
              >
                &ldquo;
              </span>
              <blockquote className="mt-2">
                <p className="text-[1.35rem] italic leading-[1.4] text-ink md:text-[1.625rem]">
                  {trimQuote(heroPullQuote)}
                </p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                — {author.name}, {author.role}
              </figcaption>
            </figure>
          ) : null}

          {/* Byline. Stacks cleanly on mobile; horizontal on md+. */}
          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:gap-6">
            <Link href={`/blog/authors/${author.id}`} className="inline-flex items-center gap-3 text-ink hover:text-accent">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft font-mono text-body-sm font-medium text-accent">
                {author.initials}
              </span>
              <span className="min-w-0">
                <span className="block text-body font-medium">{author.name}</span>
                <span className="block text-body-sm text-muted">{author.role}</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-muted md:ml-auto">
              <span>{dateFmt(post.datePublished)}</span>
              {post.dateModified && post.dateModified !== post.datePublished ? (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated {dateFmt(post.dateModified)}</span>
                </>
              ) : null}
              <span aria-hidden>·</span>
              <span>{minutes} min read</span>
            </div>
          </div>
        </div>
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
          {/* Contextual product callout. Real primary CTA + tier hint. */}
          <div className="rounded-lg border border-accent/40 bg-accent-soft/40 p-6 md:p-9">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
              From {APP_NAME}
            </p>
            <p className="mt-3 text-[1.25rem] leading-[1.45] text-ink md:text-[1.375rem]">
              {APP_NAME} runs this loop end to end. Find the right businesses, personalize
              the outreach, send it from your own inbox.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={SIGNUP_URL}
                className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-body-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                Start free with 100 credits
              </Link>
              <Link
                href="/how-it-works"
                className="text-body-sm font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-body-sm text-muted">
              No card up front. Paid credits when you want scale.
            </p>
          </div>

          {/* Beta trust strip. Real customers, real geographies. */}
          <div className="mt-10 border-y border-line py-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              Beta users
            </p>
            <p className="mt-2 text-body-lg text-ink">
              In use with beta operators across the US, UK, EU, and India.
            </p>
            <p className="mt-1 text-body-sm text-muted">
              Local B2B agencies, contractor lead-gen shops, freelance consultants, bootstrapped SaaS founders.
            </p>
          </div>

          {/* Author bio card. Prominent, distinct-voice signature line. */}
          <div className="mt-14 flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-heading-sm text-accent">
              {author.initials}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                Written by
              </p>
              <Link href={`/blog/authors/${author.id}`} className="mt-1 inline-block text-heading-md text-ink hover:text-accent">
                {author.name}
              </Link>
              <p className="text-body-sm text-muted">{author.role}</p>
              <p className="mt-4 max-w-prose text-body text-ink md:text-body-lg">{author.bio}</p>
              {author.signature ? (
                <p className="mt-3 max-w-prose text-body-sm italic text-muted">{author.signature}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Related — editorial grid with author + read time, no shadow cards. */}
      {related.length ? (
        <section aria-labelledby="keep-reading" className="article-shell mt-24">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
            <h2 id="keep-reading" className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              Keep reading
            </h2>
            <Link href="/blog" className="text-body-sm text-accent hover:text-accent-strong">
              All posts
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {related.map((r) => {
              const ra = authorFor(r.slug);
              return (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                      {r.category}
                    </p>
                    <p className="mt-3 text-[1.125rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent md:text-[1.25rem]">
                      {r.title}
                    </p>
                    {r.excerpt ? (
                      <p className="mt-3 line-clamp-3 text-body-sm leading-[1.55] text-ink/80">
                        {r.excerpt}
                      </p>
                    ) : null}
                    <p className="mt-4 flex items-center gap-2 text-body-sm text-muted">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft font-mono text-[0.6rem] text-accent">
                        {ra.initials}
                      </span>
                      <span>{ra.name}</span>
                      <span aria-hidden>·</span>
                      <span>{readMinutes(r)} min read</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Floating micro-CTA. Only on wide desktops (xl+) for long reads. */}
      {showStickyRail ? (
        <aside
          aria-label="Try Milo"
          className="pointer-events-none fixed bottom-6 right-6 z-30 hidden max-w-xs xl:block"
        >
          <div className="pointer-events-auto rounded-lg border border-accent/30 bg-canvas p-4 shadow-float">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">
              Try {APP_NAME}
            </p>
            <p className="mt-1 text-body-sm font-medium leading-snug text-ink">
              Turn what you just read into a real prospect list.
            </p>
            <Link
              href={SIGNUP_URL}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-body-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Start free
            </Link>
            <p className="mt-2 text-[0.7rem] text-muted">100 credits, no card.</p>
          </div>
        </aside>
      ) : null}
    </article>
  );
}
