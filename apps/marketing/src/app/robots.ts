// robots.txt (Next generates /robots.txt at build). Allows normal crawlers AND
// explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …) - this
// serves AEO: being crawlable is a precondition for being cited by AI assistants
// (M00 §9). References the sitemap. (M04 §1)
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// AI assistant crawlers we explicitly welcome (in addition to `*`).
// Google-Extended and Applebot-Extended are OPT-OUT tokens for training,
// not user agents in the classic sense, so they don't belong here.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/', '/_next/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
