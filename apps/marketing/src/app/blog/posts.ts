// Blog content source. Types + composed post list. Each wave lives in its own
// file so a post edit does not force a rebase of the whole file.
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id?: string }
  | { type: 'h3'; text: string; id?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'link'; text: string; href: string; label: string }
  | { type: 'tldr'; text: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; title?: string; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'stat'; value: string; label: string }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | {
      type: 'diagram';
      kind: 'workflow' | 'decision-tree' | 'matrix' | 'ladder' | 'compare';
      title: string;
      caption?: string;
      nodes: { id: string; label: string; sub?: string; emphasis?: boolean }[];
      edges?: { from: string; to: string; label?: string }[];
    }
  | { type: 'newsletter'; text?: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description. Falls back to excerpt when omitted. */
  description?: string;
  category: string;
  cluster?: string;
  tags?: string[];
  /** Card teaser. Falls back to `description` on the index when omitted. */
  excerpt?: string;
  datePublished: string;
  dateModified?: string;
  /** Read estimate in minutes. Derived from body word count if not set. */
  readMinutes?: number;
  body: Block[];
  related?: string[];
};

import { WAVE1_POSTS } from './waves/wave1';
import { WAVE2_POSTS } from './waves/wave2';
import { WAVE3_POSTS } from './waves/wave3';
import { WAVE4A_POSTS } from './waves/wave4a';
import { WAVE4B_POSTS } from './waves/wave4b';
import { WAVE4C_POSTS } from './waves/wave4c';

/**
 * All published posts. Wave 3 goes first so its refreshed versions of the three
 * existing pillars win the getPost() lookup. Wave 4 adds the higher-standards
 * batch (manifesto, definitions, taxonomies, benchmarks, cadence, verticals,
 * comparisons, founder narrative).
 */
export const BLOG_POSTS: BlogPost[] = [
  ...WAVE3_POSTS,
  ...WAVE1_POSTS,
  ...WAVE2_POSTS,
  ...WAVE4A_POSTS,
  ...WAVE4B_POSTS,
  ...WAVE4C_POSTS,
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Description with a graceful fallback chain: description -> excerpt -> title. */
export function postDescription(post: BlogPost): string {
  return post.description ?? post.excerpt ?? post.title;
}

/**
 * Rough read-time estimate at 230 words/min. Counts every string field in the
 * body union (paragraphs, list items, table cells, faq answers, steps text, etc.).
 * Used when a post omits `readMinutes`.
 */
export function readMinutes(post: BlogPost): number {
  if (post.readMinutes) return post.readMinutes;
  let words = 0;
  const count = (s: unknown) => {
    if (typeof s === 'string') words += s.trim().split(/\s+/).length;
  };
  for (const b of post.body) {
    if (b.type === 'p' || b.type === 'h2' || b.type === 'h3' || b.type === 'tldr' || b.type === 'quote') count(b.text);
    else if (b.type === 'ul' || b.type === 'ol') b.items.forEach(count);
    else if (b.type === 'callout') { count(b.title); count(b.text); }
    else if (b.type === 'steps') b.items.forEach((s) => { count(s.title); count(s.text); });
    else if (b.type === 'table') { b.headers.forEach(count); b.rows.forEach((r) => r.forEach(count)); }
    else if (b.type === 'faq') b.items.forEach((qa) => { count(qa.q); count(qa.a); });
    else if (b.type === 'link') count(b.text);
    else if (b.type === 'stat') count(b.label);
    else if (b.type === 'diagram') { count(b.title); b.nodes.forEach((n) => { count(n.label); count(n.sub); }); }
    else if (b.type === 'newsletter') count(b.text);
  }
  return Math.max(1, Math.round(words / 230));
}
