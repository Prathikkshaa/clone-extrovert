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
  /** Editorial takeaway block used in place of a "How Milo does this" closer. */
  | { type: 'takeaway'; title?: string; text: string }
  /** Explicit "who this piece is for" block, appears near top. */
  | { type: 'who-this-is-for'; items: string[] }
  /** Contextual product-mention callout, used at most twice per post at real insight moments. */
  | { type: 'product-moment'; hook: string; text: string; ctaLabel?: string; ctaHref?: string }
  /** Semantic <dl>-shaped definition list. Extractable by AI answer engines. */
  | { type: 'definition'; items: { term: string; def: string }[] }
  /** Product screenshot with a required alt caption. Ships empty-safe if src is missing. */
  | { type: 'screenshot'; src?: string; alt: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Optional shorter title for <title> / SERP snippets. Use when `title` exceeds 60 chars. */
  seoTitle?: string;
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
  /**
   * Explicit HowTo schema opt-in. Off by default because Google restricts HowTo
   * to physical-outcome tasks and now suppresses desktop rich results.
   */
  emitHowTo?: boolean;
};

/** Rough word count for BlogPosting.wordCount. Uses the same counter as readMinutes. */
export function wordCount(post: BlogPost): number {
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
    else if (b.type === 'takeaway') { count(b.title); count(b.text); }
    else if (b.type === 'who-this-is-for') b.items.forEach(count);
    else if (b.type === 'product-moment') { count(b.hook); count(b.text); }
    else if (b.type === 'definition') b.items.forEach((it) => { count(it.term); count(it.def); });
    else if (b.type === 'screenshot') { count(b.alt); count(b.caption); }
  }
  return words;
}

/** Extract a pull-quote hero string. Uses first `tldr`, else first `callout` text, else first `p`. */
export function heroQuote(post: BlogPost): string | null {
  const tldr = post.body.find((b) => b.type === 'tldr') as Extract<Block, { type: 'tldr' }> | undefined;
  if (tldr) return tldr.text;
  const callout = post.body.find((b) => b.type === 'callout') as Extract<Block, { type: 'callout' }> | undefined;
  if (callout) return callout.text;
  const p = post.body.find((b) => b.type === 'p') as Extract<Block, { type: 'p' }> | undefined;
  return p?.text ?? null;
}

import { WAVE1_POSTS } from './waves/wave1';
import { WAVE2_POSTS } from './waves/wave2';
import { WAVE3_POSTS } from './waves/wave3';
import { WAVE4A_POSTS } from './waves/wave4a';
import { WAVE4B_POSTS } from './waves/wave4b';
import { WAVE4C_POSTS } from './waves/wave4c';
import { WAVE5_POSTS } from './waves/wave5';
import { WAVE7_POSTS } from './waves/wave7';
import { WAVE6_POSTS } from './waves/wave6';

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
  ...WAVE5_POSTS,
  ...WAVE6_POSTS,
  ...WAVE7_POSTS,
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * Description for meta tags. Prefers hand-written `description`, then `excerpt`.
 * Never falls back to `title` (that produces duplicate `<title>` + `<meta description>`
 * pairs which Google flags as low-quality).
 */
export function postDescription(post: BlogPost): string {
  return post.description ?? post.excerpt ?? `${post.title}. Playbook by ${post.category.toLowerCase()} operators at ${'Milo'}.`;
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
    else if (b.type === 'takeaway') { count(b.title); count(b.text); }
    else if (b.type === 'who-this-is-for') b.items.forEach(count);
    else if (b.type === 'product-moment') { count(b.hook); count(b.text); }
    else if (b.type === 'definition') b.items.forEach((it) => { count(it.term); count(it.def); });
    else if (b.type === 'screenshot') { count(b.alt); count(b.caption); }
  }
  return Math.max(1, Math.round(words / 230));
}
