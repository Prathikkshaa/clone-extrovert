import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/reveal';
import { APP_NAME, FOUNDER_NAME, SITE_URL } from '@/lib/site';
import { BLOG_POSTS, getPost, readMinutes, type Block } from '../posts';
import { relatedFor, clusterIdFor, clusterLabel } from '../clusters';

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
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
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

/* ── Block renderer ── */
function BlockView({ block }: { block: Block }) {
  if (block.type === 'h2') {
    const id = block.id ?? slugify(block.text);
    return (
      <h2 id={id} className="scroll-mt-24 mt-12 text-heading-lg text-ink">
        {block.text}
      </h2>
    );
  }
  if (block.type === 'h3') {
    const id = block.id ?? slugify(block.text);
    return (
      <h3 id={id} className="scroll-mt-24 mt-8 text-heading-md text-ink">
        {block.text}
      </h3>
    );
  }
  if (block.type === 'ul') {
    return (
      <ul className="ml-5 list-disc space-y-2 text-body-lg text-ink/90 marker:text-accent">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'ol') {
    return (
      <ol className="ml-5 list-decimal space-y-2 text-body-lg text-ink/90 marker:text-accent">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }
  if (block.type === 'link') {
    return (
      <p className="rounded-md border-l-2 border-accent bg-accent-soft/40 py-3 pl-4 pr-3 text-body text-ink/85">
        {block.text}{' '}
        <Link href={block.href} className="font-medium text-accent underline underline-offset-2 hover:text-accent-strong">
          {block.label}
        </Link>
      </p>
    );
  }
  if (block.type === 'tldr') {
    return (
      <aside className="rounded-2xl border border-line bg-canvas p-5 md:p-6">
        <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
          TL;DR
        </p>
        <p className="mt-2 text-body-lg text-ink/90">{block.text}</p>
      </aside>
    );
  }
  if (block.type === 'callout') {
    const styles = {
      info: 'border-accent bg-accent-soft/50 text-ink',
      warn: 'border-warning bg-warning-soft text-ink',
      success: 'border-positive bg-positive-soft text-ink',
    } as const;
    const labels = { info: 'Note', warn: 'Heads up', success: 'Good to know' } as const;
    return (
      <div className={`rounded-2xl border-l-4 p-5 md:p-6 ${styles[block.tone]}`}>
        <p className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
          {block.title ?? labels[block.tone]}
        </p>
        <p className="mt-2 text-body-lg text-ink/90">{block.text}</p>
      </div>
    );
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="border-l-2 border-accent pl-5 text-body-lg italic text-ink/85">
        <p>{block.text}</p>
        {block.cite ? (
          <cite className="mt-2 block text-body-sm not-italic text-muted">— {block.cite}</cite>
        ) : null}
      </blockquote>
    );
  }
  if (block.type === 'steps') {
    return (
      <ol className="space-y-4">
        {block.items.map((it, i) => (
          <li key={i} className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-line bg-surface p-4 md:p-5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-body-sm text-accent">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-heading-sm text-ink">{it.title}</p>
              <p className="mt-1 text-body text-ink/85">{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === 'table') {
    return (
      <figure className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-line">
              {block.headers.map((h, i) => (
                <th key={i} className="py-3 pr-4 text-left font-medium text-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="py-3 pr-4 align-top text-ink/85">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {block.caption ? (
          <figcaption className="mt-2 text-body-sm text-muted">{block.caption}</figcaption>
        ) : null}
      </figure>
    );
  }
  if (block.type === 'stat') {
    return (
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-4 rounded-xl border border-line bg-surface p-5">
        <span className="font-mono text-display-md leading-none text-accent">{block.value}</span>
        <span className="text-body-sm text-muted">{block.label}</span>
      </div>
    );
  }
  if (block.type === 'faq') {
    return (
      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {block.items.map((qa, i) => (
          <div key={i} className="p-5 md:p-6">
            <dt className="text-heading-sm text-ink">{qa.q}</dt>
            <dd className="mt-2 text-body text-ink/85">{qa.a}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return <p className="text-body-lg text-ink/90">{block.text}</p>;
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

  const faqBlocks = post.body.filter((b): b is Extract<Block, { type: 'faq' }> => b.type === 'faq');
  const stepsBlocks = post.body.filter((b): b is Extract<Block, { type: 'steps' }> => b.type === 'steps');

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: { '@type': 'Person', name: FOUNDER_NAME },
    publisher: { '@type': 'Organization', name: APP_NAME },
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
    <article className="shell py-16 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} /> : null}
      {howToLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd).replace(/</g, '\\u003c') }} /> : null}

      <Reveal className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 text-body-sm">
          <Link href="/blog" className="text-accent hover:text-accent-strong">
            &larr; All posts
          </Link>
          <span aria-hidden className="h-3 w-px bg-line" />
          <span className="text-muted">{post.category}</span>
        </div>

        <h1 className="mt-6 text-display-md text-ink">{post.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-muted">
          <span>By <span className="text-ink">{FOUNDER_NAME}</span></span>
          <span aria-hidden>·</span>
          <span>{readMinutes(post)} min read</span>
          <span aria-hidden>·</span>
          <span>Published {dateFmt(post.datePublished)}</span>
          {post.dateModified && post.dateModified !== post.datePublished ? (
            <>
              <span aria-hidden>·</span>
              <span>Updated {dateFmt(post.dateModified)}</span>
            </>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-6">
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>

        {/* Footer CTA card */}
        <div className="mt-14 rounded-2xl border border-line bg-surface p-6 md:p-7">
          <p className="text-heading-sm text-ink">
            {APP_NAME} runs this loop end to end.
          </p>
          <p className="mt-2 text-body text-muted">
            Find the right businesses, research them, personalize outreach, send from your own inbox.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-body-sm">
            <Link href="/how-it-works" className="rounded-md border border-line bg-canvas px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent">
              How it works
            </Link>
            <Link href="/pricing" className="rounded-md border border-line bg-canvas px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent">
              See pricing
            </Link>
          </div>
        </div>
      </Reveal>

      {related.length ? (
        <Reveal delay={0.05} className="mx-auto mt-16 max-w-5xl">
          <p className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
            Related reading
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-card"
                >
                  <span className="text-body-sm text-muted">{r.category}</span>
                  <span className="mt-2 text-heading-sm text-ink">{r.title}</span>
                  <span className="mt-3 text-body-sm text-muted">{readMinutes(r)} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {clusterId ? (
        <div className="mx-auto mt-10 max-w-5xl text-center text-body-sm text-muted">
          More in <Link href={`/blog?cluster=${clusterId}`} className="text-accent underline underline-offset-2">{clusterLabel(clusterId)}</Link>
        </div>
      ) : null}
    </article>
  );
}
