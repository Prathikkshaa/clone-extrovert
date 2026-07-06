// PLACEHOLDER blog data (M00 §13) — one scaffold post so the hub + post route
// render and are verifiable. Real posts + a proper content source (MDX/CMS) land
// in M04. Clearly labeled so nothing fake-looking ships.
export type PlaceholderPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
};

export const PLACEHOLDER_POSTS: PlaceholderPost[] = [
  {
    slug: 'find-local-businesses-without-a-website',
    title: 'How to find local businesses with no website (and pitch them)',
    category: 'Playbook',
    excerpt:
      'A concrete way to find buying signals in your city — starting with businesses that have no website yet.',
    body: [
      'This is a placeholder post scaffolded in M01. The real content — a step-by-step playbook — is written in M04 when the blog becomes the SEO/AEO engine.',
      'The structure (title, category, readable measure, byline slot) is real so the route renders and can be verified now.',
    ],
  },
];

export function getPost(slug: string): PlaceholderPost | undefined {
  return PLACEHOLDER_POSTS.find((p) => p.slug === slug);
}
