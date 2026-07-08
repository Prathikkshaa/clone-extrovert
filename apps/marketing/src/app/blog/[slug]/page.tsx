import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, getPost, type Block } from '../posts';
import { Reveal } from '@/components/reveal';
import { APP_NAME, SITE_URL, FOUNDER_NAME } from '@/lib/site';

// Statically generate every post at build time (M00 §4 - SSG).
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
  if (!post) return { title: 'Post' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
    },
  };
}

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function BlockView({ block }: { block: Block }) {
  if (block.type === 'h2') return <h2 className="mt-10 text-heading-lg text-ink">{block.text}</h2>;
  if (block.type === 'ul') {
    return (
      <ul className="ml-5 list-disc space-y-2 text-body-lg text-ink/90 marker:text-accent">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="text-body-lg text-ink/90">{block.text}</p>;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // BlogPosting JSON-LD (AEO) - built from the post's own fields.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: { '@type': 'Person', name: FOUNDER_NAME },
    publisher: { '@type': 'Organization', name: APP_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    url: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className="shell max-w-prose py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Reveal>
        <Link href="/blog" className="text-body-sm text-accent hover:text-accent-strong">
          ← All posts
        </Link>
        <p className="mt-6 text-eyebrow uppercase text-accent">{post.category}</p>
        <h1 className="mt-2 text-display-md text-ink">{post.title}</h1>
        <p className="mt-4 text-body-sm text-muted">
          {dateFmt(post.datePublished)} · {post.readMinutes} min read
        </p>
        <div className="mt-8 flex flex-col gap-5">
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
      </Reveal>
    </article>
  );
}
