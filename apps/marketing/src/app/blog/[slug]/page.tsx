import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PLACEHOLDER_POSTS, getPost } from '../posts';
import { Reveal } from '@/components/reveal';

// Statically generate the placeholder post(s) at build time (M00 §4 — SSG).
export function generateStaticParams() {
  return PLACEHOLDER_POSTS.map((p) => ({ slug: p.slug }));
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
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="shell max-w-prose py-16 md:py-24">
      <Reveal>
        <Link href="/blog" className="text-body-sm text-accent hover:text-accent-strong">
          ← All posts
        </Link>
        <p className="mt-6 text-eyebrow uppercase text-accent">{post.category}</p>
        <h1 className="mt-2 text-display-md text-ink">{post.title}</h1>
        <p className="mt-4 text-body-sm text-muted">Placeholder post · real content in M04</p>
        <div className="mt-8 flex flex-col gap-5">
          {post.body.map((para, i) => (
            <p key={i} className="text-body-lg text-ink/90">
              {para}
            </p>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
