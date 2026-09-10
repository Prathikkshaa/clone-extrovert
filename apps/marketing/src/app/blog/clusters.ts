// Blog topical clusters. Powers the index category pills, the RelatedPosts
// component, and the taxonomy shown on cards. Kept small on purpose (M00 §8).
import { BLOG_POSTS, type BlogPost } from './posts';

export const BLOG_CLUSTERS = [
  { id: 'buying-signals', label: 'Buying signals' },
  { id: 'local-prospecting', label: 'Local prospecting' },
  { id: 'prospecting', label: 'Prospecting' },
  { id: 'verticals', label: 'Verticals' },
  { id: 'deliverability', label: 'Deliverability' },
  { id: 'compliance', label: 'Compliance' },
] as const;

export type ClusterId = (typeof BLOG_CLUSTERS)[number]['id'];

const CLUSTER_LOOKUP: Record<string, string> = {
  'buying signals': 'buying-signals',
  'local prospecting': 'local-prospecting',
  prospecting: 'prospecting',
  verticals: 'verticals',
  deliverability: 'deliverability',
  compliance: 'compliance',
  playbook: 'local-prospecting',
};

export function clusterIdFor(post: BlogPost): string | null {
  const key = (post.cluster ?? post.category).toLowerCase().trim();
  return CLUSTER_LOOKUP[key] ?? null;
}

export function clusterLabel(id: string): string {
  return BLOG_CLUSTERS.find((c) => c.id === id)?.label ?? id;
}

/**
 * Related posts. Prefer explicit `related` slugs on the post, then fall back to
 * siblings in the same cluster, newest first. Excludes self and 301'd slugs.
 */
export function relatedFor(post: BlogPost, limit = 3): BlogPost[] {
  const explicit = (post.related ?? [])
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => p !== undefined)
    .filter((p) => p.slug !== post.slug);
  if (explicit.length >= limit) return explicit.slice(0, limit);

  const seen = new Set(explicit.map((p) => p.slug));
  seen.add(post.slug);
  const targetCluster = clusterIdFor(post);
  const siblings = BLOG_POSTS.filter((p) => {
    if (seen.has(p.slug)) return false;
    return targetCluster && clusterIdFor(p) === targetCluster;
  }).sort((a, b) => (b.datePublished > a.datePublished ? 1 : -1));

  const rest = BLOG_POSTS.filter((p) => !seen.has(p.slug) && !siblings.includes(p)).sort(
    (a, b) => (b.datePublished > a.datePublished ? 1 : -1),
  );

  return [...explicit, ...siblings, ...rest].slice(0, limit);
}
