// Sitemap (Next generates /sitemap.xml at build) — all public marketing routes.
// Blog posts are pulled from the same content source so new posts appear
// automatically. (M04 §1)
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { PLACEHOLDER_POSTS } from './blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/pricing', '/how-it-works', '/about', '/blog', '/privacy', '/terms'];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = PLACEHOLDER_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
