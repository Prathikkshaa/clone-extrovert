import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/reveal';
import { APP_NAME, SITE_URL } from '@/lib/site';
import { AUTHORS, AUTHOR_BY_SLUG, type AuthorId } from '../../authors';
import { BLOG_POSTS, readMinutes } from '../../posts';

export function generateStaticParams() {
  return (Object.keys(AUTHORS) as AuthorId[]).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const author = AUTHORS[id as AuthorId];
  if (!author) return {};
  return {
    title: `${author.name} · Author`,
    description: author.bio,
    alternates: { canonical: `/blog/authors/${author.id}` },
  };
}

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = AUTHORS[id as AuthorId];
  if (!author) notFound();

  const posts = BLOG_POSTS.filter(
    (p) => (AUTHOR_BY_SLUG[p.slug] ?? 'arun') === author.id,
  ).sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    jobTitle: author.role,
    url: `${SITE_URL}/blog/authors/${author.id}`,
    worksFor: { '@type': 'Organization', name: APP_NAME, url: SITE_URL },
    knowsAbout: author.focus,
  };

  return (
    <section className="shell py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, '\\u003c') }}
      />

      <Reveal className="max-w-3xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-body-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="hover:text-ink">Blog</Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">Authors</span>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{author.name}</span>
        </nav>

        <div className="mt-8 flex items-start gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-heading-md text-accent">
            {author.initials}
          </span>
          <div className="min-w-0">
            <p className="text-eyebrow uppercase tracking-wide text-accent">Author</p>
            <h1 className="mt-1 text-display-md text-ink">{author.name}</h1>
            <p className="mt-2 text-body-lg text-muted">{author.role}</p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-body-lg text-ink/85">{author.bio}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {author.focus.map((f) => (
            <span
              key={f}
              className="rounded-full border border-line bg-surface px-3 py-1 text-body-sm text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto mt-14 max-w-5xl">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
            Written by {author.name} · {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
          <Link href="/blog" className="text-body-sm text-accent hover:text-accent-strong">
            All posts
          </Link>
        </div>
        <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-card"
              >
                <span className="text-body-sm text-muted">{p.category}</span>
                <span className="mt-2 text-heading-sm text-ink">{p.title}</span>
                <span className="mt-auto pt-4 text-body-sm text-muted">
                  {dateFmt(p.dateModified ?? p.datePublished)} · {readMinutes(p)} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
