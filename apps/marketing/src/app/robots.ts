// robots.txt (Next generates /robots.txt at build). Allows normal crawlers AND
// explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …) — this
// serves AEO: being crawlable is a precondition for being cited by AI assistants
// (M00 §9). References the sitemap. (M04 §1)
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// AI assistant crawlers we explicitly welcome (in addition to `*`).
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
