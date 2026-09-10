// Sitemap (Next generates /sitemap.xml at build) - all public marketing routes.
// Blog posts are pulled from the same content source so new posts appear
// automatically. (M04 §1)
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { BLOG_POSTS } from './blog/posts';
import { AUTHORS, type AuthorId } from './blog/authors';

// Frozen edit date. Bump manually when static pages materially change,
// rather than churning every build with `new Date()`.
const STATIC_LAST_MODIFIED = new Date('2026-09-09T00:00:00Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/pricing',
    '/how-it-works',
    '/about',
    '/blog',
    '/privacy',
    '/terms',
    '/security',
  ];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.dateModified ?? p.datePublished),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const authors: MetadataRoute.Sitemap = (Object.keys(AUTHORS) as AuthorId[]).map((id) => ({
    url: `${SITE_URL}/blog/authors/${id}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...pages, ...posts, ...authors];
}
