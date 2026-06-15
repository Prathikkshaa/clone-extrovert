// CrawlService — fetches a website's readable content + basic branding.
//
// WHY: a single reusable provider (master-context §10) for reading the user's own
// site (File 05) and lead sites (File 08). Primary: Firecrawl (clean markdown).
// Fallback: a plain fetch + Cheerio text extraction when Firecrawl has no key,
// runs out of credits, or errors. Every path returns a typed result and never
// throws unhandled. (A Playwright fallback for JS-rendered sites can be added
// later behind this same interface.)
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';

export type CrawlSource = 'firecrawl' | 'fetch' | 'none';

export interface CrawlResult {
  ok: boolean;
  text: string;
  source: CrawlSource;
  error?: string;
}

export interface SiteBranding {
  logoUrl: string | null;
  themeColor: string | null;
  title: string | null;
}

const TIMEOUT_MS = 20000;
const USER_AGENT = 'Mozilla/5.0 (compatible; ExtrovertAI/1.0)';

@Injectable()
export class CrawlService {
  private readonly logger = new Logger(CrawlService.name);

  constructor(private readonly config: ConfigService) {}

  /** Normalize user input into a URL string, or null if it can't be one. */
  normalizeUrl(input: string): string | null {
    let value = (input ?? '').trim();
    if (!value) return null;
    if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
    try {
      return new URL(value).toString();
    } catch {
      return null;
    }
  }

  /** Fetch the site's main readable text. Firecrawl first, plain fetch fallback. */
  async fetchSite(rawUrl: string): Promise<CrawlResult> {
    const url = this.normalizeUrl(rawUrl);
    if (!url) {
      return {
        ok: false,
        text: '',
        source: 'none',
        error: 'That doesn’t look like a valid website address.',
      };
    }

    const firecrawl = await this.tryFirecrawl(url);
    if (firecrawl.ok) return firecrawl;

    const fallback = await this.tryFetch(url);
    if (fallback.ok) return fallback;

    // Surface the most useful error (fallback's, then firecrawl's).
    return {
      ok: false,
      text: '',
      source: 'none',
      error: fallback.error ?? firecrawl.error ?? 'We couldn’t read that site.',
    };
  }

  /** Best-effort logo + accent color from the homepage HTML (no Firecrawl credit). */
  async fetchBranding(rawUrl: string): Promise<SiteBranding> {
    const empty: SiteBranding = { logoUrl: null, themeColor: null, title: null };
    const url = this.normalizeUrl(rawUrl);
    if (!url) return empty;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) return empty;
      const html = await res.text();
      const $ = cheerio.load(html);
      const base = new URL(url);
      const abs = (href: string | undefined): string | null => {
        if (!href) return null;
        try {
          return new URL(href, base).toString();
        } catch {
          return null;
        }
      };
      const ogImage = $('meta[property="og:image"]').attr('content');
      const icon =
        $('link[rel="apple-touch-icon"]').attr('href') ??
        $('link[rel~="icon"]').attr('href');
      const themeColor = this.validHex($('meta[name="theme-color"]').attr('content'));
      const title =
        $('meta[property="og:site_name"]').attr('content') ??
        $('title').first().text().trim() ??
        null;
      return { logoUrl: abs(ogImage) ?? abs(icon), themeColor, title: title || null };
    } catch (err) {
      this.logger.warn(`Branding fetch failed: ${(err as Error).message}`);
      return empty;
    }
  }

  private async tryFirecrawl(url: string): Promise<CrawlResult> {
    const key = this.config.get<string>('FIRECRAWL_API_KEY');
    if (!key) return { ok: false, text: '', source: 'none', error: 'Firecrawl not configured' };
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const json = (await res.json()) as { data?: { markdown?: string }; error?: string };
      const markdown = json.data?.markdown;
      if (res.ok && typeof markdown === 'string' && markdown.trim()) {
        return { ok: true, text: markdown.trim(), source: 'firecrawl' };
      }
      return {
        ok: false,
        text: '',
        source: 'none',
        error: json.error ?? `Firecrawl returned ${res.status}`,
      };
    } catch (err) {
      this.logger.warn(`Firecrawl failed, falling back to fetch: ${(err as Error).message}`);
      return { ok: false, text: '', source: 'none', error: this.describeFetchError(err) };
    }
  }

  /** Turn a raw fetch/network error into a calm, SPECIFIC message for the user
   *  (master-context §7: never leak technical strings like "fetch failed"). The
   *  real cause is inspected (DNS, refused, timeout, TLS) so we say what actually
   *  went wrong rather than a vague generic. */
  private describeFetchError(err: unknown): string {
    const e = err as {
      name?: string;
      cause?: { code?: string };
    };
    const name = e?.name ?? '';
    const code = e?.cause?.code ?? '';
    if (name === 'TimeoutError' || name === 'AbortError') {
      return 'That site took too long to respond. Check the address, or add your details by hand.';
    }
    if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
      return 'We couldn’t find a website at that address — check the spelling (e.g. example.com).';
    }
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
      return 'That website refused the connection — it may be down right now.';
    }
    if (code.startsWith('CERT_') || code.includes('TLS') || code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
      return 'That site has a security-certificate problem we couldn’t get past.';
    }
    return 'We couldn’t reach that website — it may be down or blocking us. You can add your details by hand instead.';
  }

  private async tryFetch(url: string): Promise<CrawlResult> {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        return { ok: false, text: '', source: 'none', error: `Site returned ${res.status}.` };
      }
      if (!(res.headers.get('content-type') ?? '').includes('html')) {
        return { ok: false, text: '', source: 'none', error: 'That site isn’t a readable web page.' };
      }
      const $ = cheerio.load(await res.text());
      $('script, style, noscript, svg').remove();
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      if (!text) {
        return { ok: false, text: '', source: 'none', error: 'That site had no readable text.' };
      }
      return { ok: true, text, source: 'fetch' };
    } catch (err) {
      return { ok: false, text: '', source: 'none', error: this.describeFetchError(err) };
    }
  }

  private validHex(color: string | undefined): string | null {
    const value = (color ?? '').trim();
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : null;
  }
}
